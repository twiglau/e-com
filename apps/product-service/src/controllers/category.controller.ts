import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/product-db";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const data: Prisma.CategoryCreateInput = req.body;
    const category = await prisma.category.create({
      data,
    });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const data: Prisma.CategoryUpdateInput = req.body;
    const category = await prisma.category.update({
      where: {
        id: req.params.id,
      },
      data,
    });
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get categories" });
  }
};
