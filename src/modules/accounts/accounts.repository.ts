import { Account, PendingContractChange } from "prisma/generated/client";
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
		return this.prisma.pendingContractChange.findUnique({
			where: {
				accountId_type: {
					accountId,
					type,
				},
			},
		});
	}

	async upsertPendingChange(data: {
		accountId: string;
		type: "email" | "phone";
		value: string;
		codeHash: string;
		expiresAt: Date;
	}): Promise<PendingContractChange> {
		return this.prisma.pendingContractChange.upsert({
			where: { accountId_type: { accountId: data.accountId, type: data.type } },
			create: data,
			update: data,
		});
	}

	deletePendingChange(
		accountId: string,
		type: "email" | "phone",
	): Promise<PendingContractChange> {
		return this.prisma.pendingContractChange.delete({
			where: {
				accountId_type: {
					accountId,
					type,
				},
			},
		});
	}
}
