import { AlertTriangle } from "lucide-react";

import { getLowestStockItems } from "@/actions/user-stats";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export async function LowestStockItemsTable() {
  const items = await getLowestStockItems();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Lowest Stock Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground text-center"
                >
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <span
                      className="block max-w-[250px] truncate"
                      title={item.name}
                    >
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.stock.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.unit}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.stock <= 0 ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function LowestStockItemsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
