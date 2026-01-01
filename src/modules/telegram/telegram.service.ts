import { createHash, createHmac, randomBytes } from "node:crypto";
import { AllConfigs } from "src/config";
import { RedisService } from "src/infrastructure/redis/redis.service";

import { RpcStatus } from "@mondocinema/common";
import { TelegramVerifyRequest } from "@mondocinema/contracts/gen/auth";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RpcException } from "@nestjs/microservices";

import { TokenService } from "../token/token.service";

import { TelegramRepository } from "./telegram.repository";

@Injectable()
export class TelegramService {
	private readonly BOT_ID: string;
	private readonly BOT_TOKEN: string;
	private readonly BOT_USERNAME: string;
	private readonly REDIRECT_ORIGIN: string;

	constructor(
		configService: ConfigService<AllConfigs>,
		private readonly telegramRepository: TelegramRepository,
		private readonly redis: RedisService,
		private readonly tokenService: TokenService,
	) {
		this.BOT_ID = configService.getOrThrow("telegram.botId", { infer: true });
		this.BOT_TOKEN = configService.getOrThrow("telegram.botToken", {
			infer: true,
		});
		this.BOT_USERNAME = configService.getOrThrow("telegram.botUsername", {
			infer: true,
		});
		this.REDIRECT_ORIGIN = configService.getOrThrow("telegram.redirectOrigin", {
			infer: true,
		});
	}

	getAuthUrl() {
		const url = new URL("https://oauth.telegram.org/auth");

		url.searchParams.append("bot_id", this.BOT_ID);
		url.searchParams.append("origin", this.REDIRECT_ORIGIN);
		url.searchParams.append("request_access", "write");
		url.searchParams.append("return_to", this.REDIRECT_ORIGIN);

		return { url: url.href };
	}

	async verify(data: TelegramVerifyRequest) {
		const isValid = this.checkTelegramAuth(data.query);

		if (!isValid) {
			throw new RpcException({
				code: RpcStatus.UNAUTHENTICATED,
				details: "Invalid Telegram signature",
			});
		}

		const telegramId = data.query.id;

		const exists = await this.telegramRepository.findByTelegramId(telegramId);

		if (exists && exists.phone) {
			return this.tokenService.generateTokens(exists.id);
		}

		const sessionId = randomBytes(16).toString("hex");

		await this.redis.set(
			`telegram_session:${sessionId}`,
			JSON.stringify({ telegramId, username: data.query.username }),
			"EX",
			300,
		);

		return { url: `https://t.me/${this.BOT_USERNAME}?start=${sessionId}` };
	}

	private checkTelegramAuth(query: Record<string, string>) {
		const hash = query.hash;

		if (!hash) return false;

		const dataCheckArr = Object.keys(query)
			.filter((k) => k !== "hash")
			.sort()
			.map((k) => `${k}=${query[k]}`);
		const dataCheckString = dataCheckArr.join("\n");

		const secretKey = createHash("sha256")
			.update(`${this.BOT_ID}:${this.BOT_TOKEN}`)
			.digest("hex");

		const hmac = createHmac("sha256", secretKey)
			.update(dataCheckString)
			.digest("hex");

		const isValid = hmac === hash;

		return isValid;
	}
}
