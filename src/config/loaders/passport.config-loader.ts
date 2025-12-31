import { PassportOptions } from "@mondocinema/passport";
import { ConfigService } from "@nestjs/config";

export function getPassportConfig(
	configService: ConfigService,
): PassportOptions {
	return {
		secretKey: configService.getOrThrow<string>("passport.secretKey", {
			infer: true,
		}),
	};
}
