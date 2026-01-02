import { validateEnv } from "src/shared/utils/env";

import { registerAs } from "@nestjs/config";

import { RmqConfig } from "../interfaces";
import { RmqValidator } from "../validators";

export const rmqEnv = registerAs<RmqConfig>("rmq", () => {
	validateEnv(process.env, RmqValidator);

	return {
		url: process.env.RMQ_URL,
		queue: process.env.RMQ_QUEUE,
	};
});
