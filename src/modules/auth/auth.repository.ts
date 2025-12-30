import { Account } from "prisma/generated/client";
import { AccountCreateInput } from "prisma/generated/models";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findByPhone(phone: string): Promise<Account | null> {
		return await this.prisma.account.findUnique({ where: { phone } });
	}

	async findByEmail(email: string): Promise<Account | null> {
		return await this.prisma.account.findUnique({ where: { email } });
	}

	async create(data: AccountCreateInput): Promise<Account> {
		return await this.prisma.account.create({ data });
	}
}
