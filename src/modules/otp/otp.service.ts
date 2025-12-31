import { createHash } from "node:crypto";
import { generateCode } from "patcode";
import { RedisService } from "src/infrastructure/redis/redis.service";

import { RpcStatus } from "@mondocinema/common";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class OtpService {
	constructor(private readonly redis: RedisService) {}

	async send(identifier: string, type: "phone" | "email") {
		const { code, hash } = this.generateCode();

		await this.redis.set(`otp:${type}:${identifier}`, hash, "EX", 300);

		return code;
	}

	async verify(identifier: string, code: string, type: "phone" | "email") {
		const key = `otp:${type}:${identifier}`;
		const storedHash = await this.redis.get(key);

		if (!storedHash) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Invalid or expired code",
			});
		}

		const incomingHash = createHash("sha256").update(code).digest("hex");

		if (incomingHash !== storedHash) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Invalid or expired code",
			});
		}

		await this.redis.del(key);
	}

	private generateCode() {
		const code = generateCode();
		const hash = createHash("sha256").update(code).digest("hex");

		return { code, hash };
	}
}
