import { Account } from "prisma/generated/client";

import { SendOtpRequest } from "@mondocinema/contracts/gen/auth";
import { Injectable } from "@nestjs/common";

import { AuthRepository } from "./auth.repository";

@Injectable()
export class AuthService {
	constructor(private readonly authRepository: AuthRepository) {}

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

		return { ok: true };
	}
}
