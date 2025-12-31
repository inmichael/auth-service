import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PassportValidator {
	@IsString()
	@IsNotEmpty()
	PASSPORT_SECRET_KEY: string;

	@IsNumber()
	@IsNotEmpty()
	PASSPORT_ACCESS_TTL: number;

	@IsNumber()
	@IsNotEmpty()
	PASSPORT_REFRESH_TTL: number;
}
