import { UserRepository } from "src/shared/repositories";

import { Module } from "@nestjs/common";

import { OtpModule } from "../otp/otp.module";

import { AccountsController } from "./accounts.controller";
import { AccountsRepository } from "./accounts.repository";
import { AccountsService } from "./accounts.service";

@Module({
	imports: [OtpModule],
	controllers: [AccountsController],
	providers: [AccountsService, AccountsRepository, UserRepository],
})
export class AccountsModule {}
