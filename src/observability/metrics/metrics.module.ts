import { Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import {
	makeCounterProvider,
	makeHistogramProvider,
	PrometheusModule,
} from "@willsoto/nestjs-prometheus";

import { GrpcMetricsInterceptor } from "./grpc-metrics.interceptor";

@Global()
@Module({
	imports: [
		PrometheusModule.register({
			path: "/metrics",
			defaultMetrics: {
				enabled: true,
			},
		}),
	],
	providers: [
		makeHistogramProvider({
			name: "grpc_request_duration_seconds",
			help: "gRPC request latency",
			labelNames: ["service", "method"],
			buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 1, 1.5, 2, 3, 5],
		}),
		makeCounterProvider({
			name: "grpc_requests_total",
			help: "Total gRPC requests",
			labelNames: ["service", "method", "status"],
		}),
		{
			provide: APP_INTERCEPTOR,
			useClass: GrpcMetricsInterceptor,
		},
	],
})
export class MetricsModule {}
