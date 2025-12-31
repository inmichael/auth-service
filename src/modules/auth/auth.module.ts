import { getPassportConfig } from "src/config";
import { UserRepository } from "src/shared/repositories";

import { PassportModule } from "@mondocinema/passport";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { OtpModule } from "../otp/otp.module";

import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		PassportModule.registerAsync({
			useFactory: getPassportConfig,
			inject: [ConfigService],
		}),
		OtpModule,
	],
	controllers: [AuthController],
	providers: [AuthService, AuthRepository, UserRepository],
})
export class AuthModule {}
