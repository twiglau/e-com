import { FastifyInstance } from "fastify";
import { OrderModel } from "@repo/order-db";
import { startOfMonth, subMonths } from "date-fns";
import { shouldBeUser } from "../middleware/authMiddleware";

export const orderRoute = async (fastify: FastifyInstance) => {
  // 用户订单列表
  fastify.get(
    "/user-orders",
    { preHandler: shouldBeUser },
    async (request, reply) => {
      const orders = await OrderModel.find({ userId: request.userId });
      return reply.status(200).send(orders);
    },
  );

  // 所有订单
  fastify.get("/orders", async (request, reply) => {
    const { limit, page } = request.query as { limit: number; page: number };
    const orders = await OrderModel.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    return reply.status(200).send(orders);
  });

  // 订单统计
  fastify.get("/order-stats", async (request, reply) => {
    const now = new Date();
    const sixMonthAgo = startOfMonth(subMonths(now, 5));
    const rawStats = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
          success: {
            $sum: {
              $cond: [{ $eq: ["$status", "success"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          total: 1,
          success: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]);
    return reply.status(200).send(rawStats);
  });
};
