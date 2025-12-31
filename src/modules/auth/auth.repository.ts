import { Account } from "prisma/generated/client";
import {
	AccountCreateInput,
	AccountUpdateInput,
} from "prisma/generated/models";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: AccountCreateInput): Promise<Account> {
		return await this.prisma.account.create({ data });
	}

	async update(id: string, data: AccountUpdateInput): Promise<Account> {
		return await this.prisma.account.update({ where: { id }, data });
	}
}
