import type { GrpcConfig } from "./grpc.interface";
import type { PassportConfig } from "./passport.interface";
import type { RedisConfig } from "./redis.interface";

export interface AllConfigs {
	grpc: GrpcConfig;
	redis: RedisConfig;
	passport: PassportConfig;
}
