import type { Counter, Histogram } from "prom-client";
import { tap, type Observable } from "rxjs";

import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { InjectMetric } from "@willsoto/nestjs-prometheus";

@Injectable()
export class GrpcMetricsInterceptor implements NestInterceptor {
	private readonly SERVICE_NAME = "auth";

	constructor(
		@InjectMetric("grpc_requests_total")
		private readonly counter: Counter<string>,
		@InjectMetric("grpc_request_duration_seconds")
		private readonly histogram: Histogram<string>,
	) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> {
		const method = context.getHandler().name;

		const endTimer = this.histogram.startTimer({
			service: this.SERVICE_NAME,
			method,
		});

		return next.handle().pipe(
			tap({
				next: () => {
					this.counter.inc({
						service: this.SERVICE_NAME,
						method,
						status: "OK",
					});
					endTimer();
				},
				error: () => {
					this.counter.inc({
						service: this.SERVICE_NAME,
						method,
						status: "ERROR",
					});
					endTimer();
				},
			}),
		);
	}
}
