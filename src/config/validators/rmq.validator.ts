import { IsNotEmpty, IsString, Matches } from "class-validator";

export class RmqValidator {
	@Matches(/^amqp:\/\/[^:]+:[^@]+@[^:]+:\d+$/)
	@IsNotEmpty()
	RMQ_URL: string;

	@IsString()
	@IsNotEmpty()
	RMQ_QUEUE: string;
}
