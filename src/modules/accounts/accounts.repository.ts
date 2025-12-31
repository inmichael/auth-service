import { Account, PendingContractChange } from "prisma/generated/client";
import { PendingContractChangeUpdateInput } from "prisma/generated/models";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class AccountsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<Account | null> {
		return this.prisma.account.findUnique({ where: { id } });
	}

	async findPendingChange(
		accountId: string,
		type: "email" | "phone",
	): Promise<PendingContractChange | null> {
		return this.prisma.pendingContractChange.findFirst({
			where: {
				accountId,
				type,
			},
		});
	}

	async upsertPendingChange(
		data: {
			accountId: string
		},
	): Promise<PendingContractChange> {
		return this.prisma.pendingContractChange.upsert({ where: {accountId_type: {accountId: }} });
	}
}
