import { Account } from "prisma/generated/client";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class AccountsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<Account | null> {
		return this.prisma.account.findUnique({ where: { id } });
	}
}
