import { getAnalyticsOverview } from "@/lib/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle, Package, Clock } from "lucide-react";

export default async function AnalyticsOverview() {
  const analytics = await getAnalyticsOverview();

  const stats = [
    {
      title: "Total Products",
      value: analytics.totalProducts,
      icon: Package,
      description: "Total products in the system",
    },
    {
      title: "Verified Products",
      value: analytics.verifiedProducts,
      icon: ShieldCheck,
      description: "Products verified as authentic",
    },
    {
      title: "Fraudulent Activities",
      value: analytics.fraudulentActivities,
      icon: AlertTriangle,
      description: "Confirmed fraud cases",
    },
    {
      title: "Pending Cases",
      value: analytics.pendingCases,
      icon: Clock,
      description: "Cases awaiting review",
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor product verification and fraud detection metrics
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
