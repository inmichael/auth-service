import { getPassportConfig } from "src/config";

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
	providers: [AuthService, AuthRepository],
})
export class AuthModule {}
