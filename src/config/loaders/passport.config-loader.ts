import { PassportOptions } from "@mondocinema/passport";
import { ConfigService } from "@nestjs/config";

import { AllConfigs } from "../interfaces";

export function getPassportConfig(
	configService: ConfigService<AllConfigs>,
): PassportOptions {
	return {
		secretKey: configService.getOrThrow("passport.secretKey", {
			infer: true,
		}),
	};
}
