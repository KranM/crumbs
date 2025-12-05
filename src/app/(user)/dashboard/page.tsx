"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/components/session-provider";

export default function DashboardPage() {
  const { user } = useSession();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {user.name}!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <span className="text-muted-foreground">Email:</span> {user.email}
        </p>
        <p>
          <span className="text-muted-foreground">Business:</span>{" "}
          {user.businessName ?? "N/A"}
        </p>
      </CardContent>
    </Card>
  );
}
