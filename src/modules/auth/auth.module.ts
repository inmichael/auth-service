import { UserRepository } from "src/shared/repositories";

import { Module } from "@nestjs/common";

import { OtpModule } from "../otp/otp.module";
import { TokenModule } from "../token/token.module";
import { UsersModule } from "../users/users.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [OtpModule, TokenModule, UsersModule],
	controllers: [AuthController],
	providers: [AuthService, UserRepository],
})
export class AuthModule {}
