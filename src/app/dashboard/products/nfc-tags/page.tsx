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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tag, Package, AlertTriangle, Plus, FileDown, RefreshCw } from "lucide-react";

// Sample NFC tag data
const nfcTags = [
  {
    id: "NFC-424-001",
    type: "NTAG 424 DNA",
    status: "available",
    lastTested: "2024-02-20",
    batchNumber: "B2024-01",
    assignedProduct: null,
    location: "Warehouse A"
  },
  {
    id: "NFC-424-002",
    type: "NTAG 424 DNA",
    status: "assigned",
    lastTested: "2024-02-19",
    batchNumber: "B2024-01",
    assignedProduct: "Luxury Watch X",
    location: "Production"
  },
  {
    id: "NFC-424-003",
    type: "NTAG 424 DNA",
    status: "testing",
    lastTested: "2024-02-21",
    batchNumber: "B2024-01",
    assignedProduct: null,
    location: "QA Lab"
  },
  {
    id: "NFC-424-004",
    type: "NTAG 424 DNA",
    status: "defective",
    lastTested: "2024-02-18",
    batchNumber: "B2024-01",
    assignedProduct: null,
    location: "QA Lab"
  }
];

export default function NFCTagManagement() {
  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NFC Tag Management</h1>
          <p className="text-muted-foreground">Track and manage your NFC tag inventory</p>
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
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Tags</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">856</div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">378</div>
            <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
            <p className="text-xs text-muted-foreground">Locations need restock</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>Current stock levels across locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Warehouse A</p>
                  <p className="text-sm text-muted-foreground">456 tags available</p>
                </div>
                <span className="text-sm text-muted-foreground">76%</span>
              </div>
              <Progress value={76} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Production Floor</p>
                  <p className="text-sm text-muted-foreground">234 tags available</p>
                </div>
                <span className="text-sm text-muted-foreground">39%</span>
              </div>
              <Progress value={39} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">QA Lab</p>
                  <p className="text-sm text-muted-foreground">166 tags available</p>
                </div>
                <span className="text-sm text-muted-foreground">28%</span>
              </div>
              <Progress value={28} className="bg-destructive/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert for Low Stock */}
      <Alert variant="destructive" className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Low Stock Warning</AlertTitle>
        <AlertDescription>
          QA Lab location is running low on NFC tags. Consider reordering or redistributing from other locations.
        </AlertDescription>
      </Alert>

      {/* Tag Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tag Inventory</CardTitle>
          <CardDescription>Detailed view of all NFC tags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Input className="max-w-sm" placeholder="Search tags..." />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="defective">Defective</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nfcTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.id}</TableCell>
                  <TableCell>{tag.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tag.status === 'available' ? 'default' :
                        tag.status === 'assigned' ? 'secondary' :
                        tag.status === 'testing' ? 'outline' :
                        'destructive'
                      }
                    >
                      {tag.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{tag.lastTested}</TableCell>
                  <TableCell>{tag.batchNumber}</TableCell>
                  <TableCell>{tag.assignedProduct || '—'}</TableCell>
                  <TableCell>{tag.location}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Test Tag
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Test NFC Tag</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will initiate a diagnostic test on the NFC tag. The tag will be temporarily unavailable during testing.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Start Test</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}