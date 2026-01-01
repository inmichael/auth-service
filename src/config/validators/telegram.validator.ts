import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class TelegramValidator {
	@IsString()
	@IsNotEmpty()
	TELEGRAM_BOT_ID: string;

	@IsString()
	@IsNotEmpty()
	TELEGRAM_BOT_TOKEN: string;

	@IsString()
	@IsNotEmpty()
	TELEGRAM_BOT_USERNAME: string;

	@IsUrl()
	@IsNotEmpty()
	TELEGRAM_REDIRECT_ORIGIN: string;
}
