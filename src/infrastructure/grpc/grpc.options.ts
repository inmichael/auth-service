import { PROTO_PATHS } from "@mondocinema/contracts";
import { GrpcOptions } from "@nestjs/microservices";

export const grpcPackages = ["auth.v1", "accounts.v1"];

export const grpcProtoPaths = [PROTO_PATHS.AUTH, PROTO_PATHS.ACCOUNTS];

export const grpcLoader: NonNullable<GrpcOptions["options"]["loader"]> = {
	keepCase: false,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
};
