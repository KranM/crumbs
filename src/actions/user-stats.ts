"use server";

import { db } from "@/db/index";
import { inventory } from "@/db/schema/inventory";
import { recipes } from "@/db/schema/recipes";
import { requireUserSession } from "@/lib/auth-helpers";
import { count, eq, and, lte, sql } from "drizzle-orm";

export type UserDashboardStats = {
  totalInventoryItems: number;
  totalInventoryValue: number;
  outOfStockItems: number;
  totalRecipes: number;
};

export async function getUserDashboardStats(): Promise<UserDashboardStats> {
  const session = await requireUserSession();
  const userId = session.id;

  const [
    totalInventoryItemsResult,
    totalInventoryValueResult,
    outOfStockItemsResult,
    totalRecipesResult,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(inventory)
      .where(eq(inventory.userId, userId)),

    db
      .select({
        value: sql<string>`sum(${inventory.stock} * (${inventory.purchaseCost} / ${inventory.purchaseQuantity}))`,
      })
      .from(inventory)
      .where(eq(inventory.userId, userId)),

    db
      .select({ count: count() })
      .from(inventory)
      .where(and(eq(inventory.userId, userId), lte(inventory.stock, "0"))),

    db
      .select({ count: count() })
      .from(recipes)
      .where(eq(recipes.userId, userId)),
  ]);

  return {
    totalInventoryItems: totalInventoryItemsResult[0]?.count ?? 0,
    totalInventoryValue: Number(totalInventoryValueResult[0]?.value ?? 0),
    outOfStockItems: outOfStockItemsResult[0]?.count ?? 0,
    totalRecipes: totalRecipesResult[0]?.count ?? 0,
  };
}

export type LowestStockItem = {
  id: string;
  name: string;
  stock: number;
  unit: string;
};

export async function getLowestStockItems(): Promise<LowestStockItem[]> {
  const session = await requireUserSession();
  const userId = session.id;

  const items = await db
    .select({
      id: inventory.id,
      name: inventory.name,
      stock: inventory.stock,
      unit: inventory.unit,
    })
    .from(inventory)
    .where(eq(inventory.userId, userId))
    .orderBy(inventory.stock)
    .limit(5);

  return items.map((item) => ({
    ...item,
    stock: Number(item.stock),
  }));
}
