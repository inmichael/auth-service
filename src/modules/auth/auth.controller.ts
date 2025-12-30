import type {
	SendOtpRequest,
	SendOtpResponse,
} from "@mondocinema/contracts/gen/auth";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@GrpcMethod("AuthService", "SendOtp")
	async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
		console.log("Incoming OTP Request: ", data);

		return { ok: true };
	}
}
