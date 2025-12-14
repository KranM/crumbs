import { Suspense } from "react";
import { Package, ChefHat, AlertTriangle, ScrollText } from "lucide-react";

import { requireUserSession } from "@/lib/auth-helpers";
import { getUserDashboardStats } from "@/actions/user-stats";
import { getUserSettings } from "@/actions/settings";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";

import {
  LowestStockItemsTable,
  LowestStockItemsTableSkeleton,
} from "@/components/dashboard/lowest-stock-table";

async function DashboardStats() {
  const [stats, settings] = await Promise.all([
    getUserDashboardStats(),
    getUserSettings(),
  ]);

  const currency = settings.currency;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Inventory Value"
        value={stats.totalInventoryValue}
        icon={Package}
        formatter={(val) =>
          `${currency}${val.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        }
        description="Current value of all stock"
      />
      <StatCard
        title="Out of Stock Items"
        value={stats.outOfStockItems}
        icon={AlertTriangle}
        description="Items with no stock"
      />
      <StatCard
        title="Total Inventory Items"
        value={stats.totalInventoryItems}
        icon={ScrollText}
        description="Ingredients and others"
      />
      <StatCard
        title="Total Recipes"
        value={stats.totalRecipes}
        icon={ChefHat}
        description="Total number of recipes"
      />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  await requireUserSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business operations
        </p>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>
      <Suspense fallback={<LowestStockItemsTableSkeleton />}>
        <LowestStockItemsTable />
      </Suspense>
    </div>
  );
}
