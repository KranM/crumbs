"use client";

import { useState } from "react";
import { type InventoryItem } from "@/actions/inventory";
import { EditInventoryDialog } from "./edit-inventory-dialog";
import { DeleteInventoryAlert } from "./delete-inventory-alert";
import { AddStockDialog } from "./add-stock-dialog";
import { DataTable } from "@/components/data-table";
import { getInventoryColumns } from "./inventory-columns";

type InventoryTableProps = {
  items: InventoryItem[];
};

export function InventoryTable({ items }: InventoryTableProps) {
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null);
  const [addStockItem, setAddStockItem] = useState<InventoryItem | null>(null);

  const columns = getInventoryColumns({
    onEdit: setEditItem,
    onDelete: setDeleteItem,
    onAddStock: setAddStockItem,
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        searchPlaceholder="Search inventory..."
      />

      <EditInventoryDialog
        key={editItem?.id}
        item={editItem}
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
      />

      <DeleteInventoryAlert
        key={deleteItem?.id}
        item={deleteItem}
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      />

      <AddStockDialog
        key={addStockItem?.id}
        item={addStockItem}
        open={!!addStockItem}
        onOpenChange={(open) => !open && setAddStockItem(null)}
      />
    </>
  );
}
