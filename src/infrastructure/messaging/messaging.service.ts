import type {
	EmailChangedEvent,
	OtpRequestedEvent,
	PhoneChangedEvent,
} from "@mondocinema/contracts";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class MessagingService {
	constructor(
		@Inject("NOTIFICATIONS_CLIENT") private readonly client: ClientProxy,
	) {}

	async otpRequested(data: OtpRequestedEvent) {
		return this.client.emit("auth.otp.requested", data);
	}

	async phoneChanged(data: PhoneChangedEvent) {
		return this.client.emit("account.phone.changed", data);
	}

	async emailChanged(data: EmailChangedEvent) {
		return this.client.emit("account.email.changed", data);
	}
}
