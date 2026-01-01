import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { grpcEnv, passportEnv, redisEnv, telegramEnv } from "./config";
import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { RedisModule } from "./infrastructure/redis/redis.module";
import { AccountsModule } from "./modules/accounts/accounts.module";
import { AuthModule } from "./modules/auth/auth.module";
import { OtpModule } from "./modules/otp/otp.module";
import { TelegramModule } from './modules/telegram/telegram.module';
import { TokenModule } from './modules/token/token.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [grpcEnv, redisEnv, passportEnv, telegramEnv],
		}),
		PrismaModule,
		RedisModule,
		AuthModule,
		OtpModule,
		AccountsModule,
		TelegramModule,
		TokenModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
