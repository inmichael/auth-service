import type {
	RefreshRequest,
	RefreshResponse,
	SendOtpRequest,
	SendOtpResponse,
	VerifyOtpRequest,
	VerifyOtpResponse,
} from "@mondocinema/contracts/gen/auth";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@GrpcMethod("AuthService", "SendOtp")
	async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
		return await this.authService.sendOtp(data);
	}

	@GrpcMethod("AuthService", "VerifyOtp")
	async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
		return await this.authService.verifyOtp(data);
	}

	@GrpcMethod("AuthService", "Refresh")
	async refresh(data: RefreshRequest): Promise<RefreshResponse> {
		return await this.authService.refresh(data);
	}
}
