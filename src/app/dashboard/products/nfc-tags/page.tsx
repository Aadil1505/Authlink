// import { authCheck } from "@/lib/actions/auth";

// export default async function Page() {
//     await authCheck()
//   return (
//     <div className="container mx-auto py-10">
//       {/* <EmployeForm /> */}
//     </div>
//   )
// }

// app/dashboard/products/nfc-tags/page.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Tag,
  Package,
  AlertTriangle,
  Plus,
  FileDown,
  RefreshCw,
} from "lucide-react";
import {
  getNFCTagStats,
  getLocationInventory,
  getNFCTags,
} from "@/lib/actions/nfcTags";
import { format } from "date-fns";

export default async function NFCTagManagement() {
  const stats = await getNFCTagStats();
  const locations = await getLocationInventory();
  const { tags } = await getNFCTags(1, 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "assigned":
        return "bg-blue-500";
      case "testing":
        return "bg-yellow-500";
      case "defective":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            NFC Tag Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage your NFC tag inventory
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export Inventory
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Order New Tags
          </Button>
        </div>
      </div>

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalTags.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Tags
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.availableTags.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for assignment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.inUseTags.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alert
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.lowStockLocations}
            </div>
            <p className="text-xs text-muted-foreground">
              Locations need restock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>
            Current stock levels across locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locations.map((location) => (
              <div key={location.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{location.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {location.available_tags} tags available
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {location.stock_percentage}%
                  </span>
                </div>
                <Progress
                  value={location.stock_percentage}
                  className={
                    location.stock_percentage < 30
                      ? "bg-destructive/20"
                      : location.stock_percentage > 100
                      ? "bg-black"
                      : "bg-primary"
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Warning */}
      {stats.lowStockLocations > 0 && (
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Low Stock Warning</AlertTitle>
          <AlertDescription>
            {locations.find((l) => l.stock_percentage < 30)?.name} location is
            running low on NFC tags. Consider reordering or redistributing from
            other locations.
          </AlertDescription>
        </Alert>
      )}

      {/* Tag Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Tag Inventory</CardTitle>
          <CardDescription>Detailed view of all NFC tags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Input placeholder="Search tags..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="defective">Defective</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Tested</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Assigned Product</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">{tag.id}</TableCell>
                    <TableCell>{tag.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tag.status)}>
                        {tag.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(tag.last_tested), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{tag.batch_number}</TableCell>
                    <TableCell>{tag.product_name || "—"}</TableCell>
                    <TableCell>{tag.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
