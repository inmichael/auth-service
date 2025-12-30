import { Account } from "prisma/generated/client";

import {
	SendOtpRequest,
	VerifyOtpRequest,
	VerifyOtpResponse,
} from "@mondocinema/contracts/gen/auth";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { OtpService } from "../otp/otp.service";

import { AuthRepository } from "./auth.repository";

@Injectable()
export class AuthService {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly otpService: OtpService,
	) {}

	async sendOtp({ identifier, type }: SendOtpRequest) {
		let account: Account | null;

		if (type === "phone") {
			account = await this.authRepository.findByPhone(identifier);
		} else {
			account = await this.authRepository.findByEmail(identifier);
		}

		if (!account) {
			account = await this.authRepository.create({
				email: type === "email" ? identifier : undefined,
				phone: type === "phone" ? identifier : undefined,
			});
		}

		const code = await this.otpService.send(
			identifier,
			type as "phone" | "email",
		);

		console.debug("CODE: ", code);

		return { ok: true };
	}

	async verifyOtp({ code, identifier, type }: VerifyOtpRequest) {
		await this.otpService.verify(identifier, code, type as "phone" | "email");

		let account: Account | null;

		if (type === "phone") {
			account = await this.authRepository.findByPhone(identifier);
		} else {
			account = await this.authRepository.findByEmail(identifier);
		}

		if (!account) {
			throw new RpcException("Account not found");
		}

		if (type === "phone" && !account.isPhoneVerified) {
			await this.authRepository.update(account.id, { isPhoneVerified: true });
		}

		if (type === "email" && !account.isEmailVerified) {
			await this.authRepository.update(account.id, { isEmailVerified: true });
		}

		return { accessToken: "123456", refreshToken: "123456" };
	}
}
