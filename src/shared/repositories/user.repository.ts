import type { Account } from "prisma/generated/client";
import type { AccountUpdateInput } from "prisma/generated/models";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findByPhone(phone: string): Promise<Account | null> {
		return await this.prisma.account.findUnique({ where: { phone } });
	}

	async findByEmail(email: string): Promise<Account | null> {
		return await this.prisma.account.findUnique({ where: { email } });
	}

	async update(id: string, data: AccountUpdateInput): Promise<Account> {
		return await this.prisma.account.update({ where: { id }, data });
	}
}
