import type {
	ConfirmEmailChangeRequest,
	ConfirmEmailChangeResponse,
	ConfirmPhoneChangeRequest,
	GetAccountRequest,
	GetAccountResponse,
	InitEmailChangeRequest,
	InitEmailChangeResponse,
	InitPhoneChangeRequest,
	InitPhoneChangeResponse,
} from "@mondocinema/contracts/gen/accounts";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { AccountsService } from "./accounts.service";

@Controller()
export class AccountsController {
	constructor(private readonly accountsService: AccountsService) {}

	@GrpcMethod("AccountsService", "GetAccount")
	async getAccount(data: GetAccountRequest): Promise<GetAccountResponse> {
		return await this.accountsService.getAccount(data);
	}

	@GrpcMethod("AccountsService", "InitEmailChange")
	async initEmailChange(
		data: InitEmailChangeRequest,
	): Promise<InitEmailChangeResponse> {
		return await this.accountsService.initEmailChange(data);
	}

	@GrpcMethod("AccountsService", "ConfirmEmailChange")
	async confirmEmailChange(
		data: ConfirmEmailChangeRequest,
	): Promise<ConfirmEmailChangeResponse> {
		return await this.accountsService.confirmEmailChange(data);
	}

	@GrpcMethod("AccountsService", "InitPhoneChange")
	async initPhoneChange(
		data: InitPhoneChangeRequest,
	): Promise<InitPhoneChangeResponse> {
		return await this.accountsService.initPhoneChange(data);
	}

	@GrpcMethod("AccountsService", "ConfirmPhoneChange")
	async confirmPhoneChange(
		data: ConfirmPhoneChangeRequest,
	): Promise<ConfirmEmailChangeResponse> {
		return await this.accountsService.confirmPhoneChange(data);
	}
}
