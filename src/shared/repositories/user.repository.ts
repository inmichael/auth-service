import { Account } from "prisma/generated/client";
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
}
