import { RedisModule } from "src/infrastructure/redis/redis.module";

import { Module } from "@nestjs/common";

import { TokenModule } from "../token/token.module";

import { TelegramController } from "./telegram.controller";
import { TelegramRepository } from "./telegram.repository";
import { TelegramService } from "./telegram.service";

@Module({
	imports: [RedisModule, TokenModule],
	controllers: [TelegramController],
	providers: [TelegramService, TelegramRepository],
})
export class TelegramModule {}
