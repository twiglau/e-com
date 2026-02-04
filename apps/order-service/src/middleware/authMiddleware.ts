import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import type { CustomJwtSessionClaims } from "@repo/types";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

/**
 * 中间件确实有问题 (Fastify)：在 order-service 中，shouldBeUser 是一个同步函数且只有两个参数。
 * 在 Fastify 4/5 中，这会导致请求挂起（hang）。我需要将其改为 async 函数。
 * @param request
 * @param reply
 * @returns
 */
export const shouldBeUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const auth = getAuth(request);
  if (!auth?.userId) {
    return reply.status(401).send({ message: "You are not logged in" });
  }
  request.userId = auth.userId;
};

export const shouldBeAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const auth = getAuth(request);
  console.log("auth", auth);
  if (!auth?.userId) {
    return reply.status(401).send({ message: "You are not logged in" });
  }
  const sessionClaims = auth.sessionClaims as CustomJwtSessionClaims;

  if (sessionClaims?.metadata?.role !== "admin") {
    return reply.status(403).send({ message: "You are not authorized" });
  }
  request.userId = auth.userId;
};
