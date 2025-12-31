import { validateEnv } from "src/shared/utils/env";

import { registerAs } from "@nestjs/config";

import type { GrpcConfig } from "../interfaces";
import { GrpcValidator } from "../validators";

export const grpcEnv = registerAs<GrpcConfig>("grpc", () => {
	validateEnv(process.env, GrpcValidator);

	return {
		host: process.env.GRPC_HOST,
		port: parseInt(process.env.GRPC_PORT),
	};
});
