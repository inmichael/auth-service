import { AllConfigs } from "src/config";

import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { MessagingService } from "./messaging.service";

@Global()
@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: "NOTIFICATIONS_CLIENT",
				useFactory(configService: ConfigService<AllConfigs>) {
					return {
						transport: Transport.RMQ,
						options: {
							urls: [
								configService.getOrThrow<string>("rmq.url", { infer: true }),
							],
							queue: configService.getOrThrow<string>("rmq.queue", {
								infer: true,
							}),
							queueOptions: {
								durable: true,
							},
						},
					};
				},
				inject: [ConfigService],
			},
		]),
	],
	providers: [MessagingService],
	exports: [MessagingService],
})
export class MessagingModule {}
