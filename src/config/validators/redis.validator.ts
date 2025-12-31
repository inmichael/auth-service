import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class RedisValidator {
	@IsString()
	@IsNotEmpty()
	REDIS_USER: string;

	@IsString()
	@IsNotEmpty()
	REDIS_PASSWORD: string;

	@IsString()
	@IsNotEmpty()
	REDIS_HOST: string;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(65535)
	REDIS_PORT: string;
}
