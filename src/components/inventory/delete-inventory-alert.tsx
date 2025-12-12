"use client";

import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteInventoryItem, type InventoryItem } from "@/actions/inventory";
import { toast } from "sonner";

type DeleteInventoryAlertProps = {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteInventoryAlert({
  item,
  open,
  onOpenChange,
}: DeleteInventoryAlertProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!item) return;

    startTransition(async () => {
      try {
        await deleteInventoryItem(item.id);
        toast.success("Item deleted successfully!");
        onOpenChange(false);
      } catch {
        toast.error("Failed to delete item. Please try again.");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Inventory Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{item?.name}&quot;? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
