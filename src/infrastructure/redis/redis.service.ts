import Redis from "ioredis";

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

	constructor(configService: ConfigService) {
		super({
			host: configService.getOrThrow<string>("REDIS_HOST"),
			username: configService.getOrThrow<string>("REDIS_USER"),
			password: configService.getOrThrow<string>("REDIS_PASSWORD"),
			port: configService.getOrThrow<number>("REDIS_PORT"),
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
