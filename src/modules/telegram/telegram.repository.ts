import type { Account } from "prisma/generated/client";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class TelegramRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findByTelegramId(telegramId: string): Promise<Account | null> {
		return await this.prisma.account.findUnique({ where: { telegramId } });
	}
}
