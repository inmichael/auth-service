import { UserRepository } from "src/shared/repositories";

import { convertEnum, RpcStatus } from "@mondocinema/common";
import {
	ConfirmEmailChangeRequest,
	ConfirmPhoneChangeRequest,
	GetAccountRequest,
	InitEmailChangeRequest,
	InitPhoneChangeRequest,
} from "@mondocinema/contracts/gen/accounts";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { OtpService } from "../otp/otp.service";

import { AccountsRepository } from "./accounts.repository";

enum Role {
	USER = 0,
	ADMIN = 1,
	UNRECOGNIZED = -1,
}

@Injectable()
export class AccountsService {
	constructor(
		private readonly accountRepository: AccountsRepository,
		private readonly userRepository: UserRepository,
		private readonly otpService: OtpService,
	) {}

	async getAccount({ id }: GetAccountRequest) {
		const account = await this.accountRepository.findById(id);

		if (!account) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Account not found",
			});
		}

		return {
			id: account.id,
			phone: account.phone,
			email: account.email,
			isPhoneVerified: account.isPhoneVerified,
			isEmailVerified: account.isEmailVerified,
			role: convertEnum(Role, account.role),
		};
	}

	async initEmailChange({ email, userId }: InitEmailChangeRequest) {
		return this.initContactChange({
			userId,
			value: email,
			type: "email",
			alreadyExistsMessage: "Email already in use",
			findExisting: (contactValue) =>
				this.userRepository.findByEmail(contactValue),
		});
	}

	async confirmEmailChange({ code, email, userId }: ConfirmEmailChangeRequest) {
		return this.confirmContactChange({
			userId,
			code,
			value: email,
			type: "email",
			mismatchMessage: "Email mismatch",
			updateData: { email, isEmailVerified: true },
		});
	}

	async initPhoneChange({ phone, userId }: InitPhoneChangeRequest) {
		return this.initContactChange({
			userId,
			value: phone,
			type: "phone",
			alreadyExistsMessage: "Phone already is use",
			findExisting: (contactValue) =>
				this.userRepository.findByPhone(contactValue),
		});
	}

	async confirmPhoneChange({ code, phone, userId }: ConfirmPhoneChangeRequest) {
		return this.confirmContactChange({
			userId,
			code,
			value: phone,
			type: "phone",
			mismatchMessage: "Phone mismatch",
			updateData: { phone, isPhoneVerified: true },
		});
	}

	private async initContactChange<T>({
		userId,
		value,
		type,
		alreadyExistsMessage,
		findExisting,
	}: {
		userId: string;
		value: string;
		type: "email" | "phone";
		alreadyExistsMessage: string;
		findExisting: (contactValue: string) => Promise<T | null>;
	}) {
		const existing = await findExisting(value);

		if (existing) {
			throw new RpcException({
				code: RpcStatus.ALREADY_EXISTS,
				details: alreadyExistsMessage,
			});
		}

		const { code, hash } = await this.otpService.send(value, type);

		console.log("code: ", code);

		await this.accountRepository.upsertPendingChange({
			accountId: userId,
			type,
			value,
			codeHash: hash,
			expiresAt: new Date(Date.now() + 5 * 60 * 1000),
		});

		return { ok: true };
	}

	private async confirmContactChange({
		userId,
		code,
		value,
		type,
		mismatchMessage,
		updateData,
	}: {
		userId: string;
		code: string;
		value: string;
		type: "email" | "phone";
		mismatchMessage: string;
		updateData: {
			email?: string;
			phone?: string;
			isEmailVerified?: boolean;
			isPhoneVerified?: boolean;
		};
	}) {
		const pending = await this.accountRepository.findPendingChange(
			userId,
			type,
		);

		if (!pending) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "No pending request",
			});
		}

		if (pending.value !== value) {
			throw new RpcException({
				code: RpcStatus.INVALID_ARGUMENT,
				details: mismatchMessage,
			});
		}

		if (pending.expiresAt < new Date()) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Code expired",
			});
		}

		await this.otpService.verify(pending.value, code, type);

		await this.userRepository.update(userId, updateData);

		await this.accountRepository.deletePendingChange(userId, type);

		return { ok: true };
	}
}
