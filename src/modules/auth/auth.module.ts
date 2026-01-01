import { UserRepository } from "src/shared/repositories";

import { Module } from "@nestjs/common";

import { OtpModule } from "../otp/otp.module";
import { TokenModule } from "../token/token.module";

import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

@Module({
	imports: [OtpModule, TokenModule],
	controllers: [AuthController],
	providers: [AuthService, AuthRepository, UserRepository],
})
export class AuthModule {}
