"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { InventoryItem } from "@/actions/inventory";

function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatQuantity(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function calculateUnitCost(
  purchaseCost: string,
  purchaseQuantity: string,
): string {
  const cost = parseFloat(purchaseCost);
  const qty = parseFloat(purchaseQuantity);
  if (isNaN(cost) || isNaN(qty) || qty === 0) return "0";
  return (cost / qty).toLocaleString(undefined, { maximumFractionDigits: 4 });
}

type InventoryColumnsProps = {
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onAddStock: (item: InventoryItem) => void;
};

export function getInventoryColumns({
  onEdit,
  onDelete,
  onAddStock,
}: InventoryColumnsProps): ColumnDef<InventoryItem>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("category")}</span>
      ),
    },
    {
      id: "supplier",
      accessorFn: (row) => row.supplier ?? "",
      header: "Supplier",
      cell: ({ row }) => row.getValue("supplier") || "—",
    },
    {
      accessorKey: "purchaseCost",
      header: ({ column }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="-mr-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Purchase Cost
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          {formatCurrency(row.getValue("purchaseCost"))}
        </div>
      ),
    },
    {
      accessorKey: "purchaseQuantity",
      header: () => <div className="text-right">Purchase Qty</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {formatQuantity(row.getValue("purchaseQuantity"))}
        </div>
      ),
    },
    {
      accessorKey: "unit",
      header: "Unit",
    },
    {
      id: "unitCost",
      accessorFn: (row) => {
        const cost = parseFloat(row.purchaseCost);
        const qty = parseFloat(row.purchaseQuantity);
        if (isNaN(cost) || isNaN(qty) || qty === 0) return 0;
        return cost / qty;
      },
      header: ({ column }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="-mr-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Unit Cost
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="text-right">
            {calculateUnitCost(item.purchaseCost, item.purchaseQuantity)}
          </div>
        );
      },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="-mr-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Stock
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          {formatQuantity(row.getValue("stock"))}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAddStock(item)}>
                Add Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(item)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
