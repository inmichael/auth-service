import type { GrpcConfig } from "./grpc.interface";
import type { PassportConfig } from "./passport.interface";
import type { RedisConfig } from "./redis.interface";
import { TelegramConfig } from "./telegram.interface";

export interface AllConfigs {
	grpc: GrpcConfig;
	redis: RedisConfig;
	passport: PassportConfig;
	telegram: TelegramConfig;
}
