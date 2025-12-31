import Redis from "ioredis";
import type { AllConfigs } from "src/config";

import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisService
	extends Redis
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(RedisService.name);

	constructor(configService: ConfigService<AllConfigs>) {
		super({
			host: configService.getOrThrow("redis.host", { infer: true }),
			username: configService.getOrThrow("redis.user", { infer: true }),
			password: configService.getOrThrow("redis.password", { infer: true }),
			port: configService.getOrThrow("redis.port", { infer: true }),
			maxRetriesPerRequest: 5,
			enableOfflineQueue: true,
		});
	}

	async onModuleInit() {
		const start = Date.now();

		this.logger.log("Initializing Redis connection...");

		this.on("connect", () => {
			this.logger.log("Redis connecting...");
		});

		this.on("ready", () => {
			const ms = Date.now() - start;

			this.logger.log(`Redis connection established (time=${ms}ms)`);
		});

		this.on("error", (err) => {
			this.logger.error("Redis error", { error: err.message ?? err });
		});

		this.on("close", () => {
			this.logger.warn("Redis connection closed");
		});

		this.on("reconnecting", () => {
			this.logger.log("Redis reconnecting...");
		});
	}

	async onModuleDestroy() {
		this.logger.log("Closing Redis connection");

		try {
			await this.quit();

			this.logger.log("Redis connection closed");
		} catch (err) {
			this.logger.error("Error closing redis connection: ", err);
		}
	}
}
