import { convertEnum, RpcStatus } from "@mondocinema/common";
import { GetAccountRequest } from "@mondocinema/contracts/gen/accounts";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { AccountsRepository } from "./accounts.repository";

enum Role {
	USER = 0,
	ADMIN = 1,
	UNRECOGNIZED = -1,
}

@Injectable()
export class AccountsService {
	constructor(private readonly accountRepository: AccountsRepository) {}

	async getAccount({ id }: GetAccountRequest) {
		const account = await this.accountRepository.findById(id);

		if (!account) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Account not found",
			});
		}

		return {
			id: account.id,
			phone: account.phone,
			email: account.email,
			isPhoneVerified: account.isPhoneVerified,
			isEmailVerified: account.isEmailVerified,
			role: convertEnum(Role, account.role),
		};
	}
}
