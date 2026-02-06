import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/product-db";
import { StripeProductType } from "@repo/types";
import { kafkaProducer } from "../utils/kafka";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data: Prisma.ProductCreateInput = req.body;
    const { colors, images, ...rest } = data;

    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return res.status(400).json({ error: "Colors array is required" });
    }
    if (!images || typeof images !== "object") {
      return res.status(400).json({ error: "Images is required" });
    }

    const missingColors = colors.filter((color) => !(color in images));
    if (missingColors.length > 0) {
      return res.status(400).json({
        error: "Missing images for colors: " + missingColors.join(", "),
      });
    }
    const product = await prisma.product.create({
      data,
    });

    const stripeProduct: StripeProductType = {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
    };
    kafkaProducer.send("product.created", {
      value: stripeProduct,
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: Prisma.ProductUpdateInput = req.body;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const { sort, category, search, limit, page } = req.query;
  const orderBy = (() => {
    switch (sort) {
      case "asc":
        return { price: Prisma.SortOrder.asc };
      case "desc":
        return { price: Prisma.SortOrder.desc };
      case "oldest":
        return { createdAt: Prisma.SortOrder.asc };
      default:
        return { createdAt: Prisma.SortOrder.desc };
    }
  })();
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: category as string,
        },
        name: {
          contains: search as string,
          mode: "insensitive",
        },
      },
      orderBy,
      take: limit ? Number(limit) : undefined,
      skip: page ? (Number(page) - 1) * Number(limit) : undefined,
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get product" });
  }
};
