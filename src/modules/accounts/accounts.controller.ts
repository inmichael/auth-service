import type {
	GetAccountRequest,
	GetAccountResponse,
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
}
