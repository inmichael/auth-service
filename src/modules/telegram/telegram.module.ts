import { RedisModule } from "src/infrastructure/redis/redis.module";
import { UserRepository } from "src/shared/repositories";

import { Module } from "@nestjs/common";

import { TokenModule } from "../token/token.module";

import { TelegramController } from "./telegram.controller";
import { TelegramRepository } from "./telegram.repository";
import { TelegramService } from "./telegram.service";

@Module({
	imports: [RedisModule, TokenModule],
	controllers: [TelegramController],
	providers: [TelegramService, TelegramRepository, UserRepository],
})
export class TelegramModule {}
