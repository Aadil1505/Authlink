// import { authCheck } from "@/lib/actions/auth";

// export default async function Page() {
//     await authCheck()
//   return (
//     <div className="container mx-auto py-10">
//       {/* <EmployeForm /> */}
//     </div>
//   )
// }

// app/dashboard/products/catalog/page.tsx
// app/dashboard/products/catalog/page.tsx
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Filter, MoreVertical, Download, PlusCircle, Tag, Package } from "lucide-react";

// Sample data
const products = [
  {
    id: "PRD001",
    name: "Luxury Watch Model X",
    category: "Luxury",
    registrationDate: "2024-02-20",
    verifications: 245,
    status: "active",
    image: "/placeholder-watch.jpg",
    description: "Premium luxury timepiece with automatic movement and sapphire crystal.",
  },
  {
    id: "PRD002",
    name: "Designer Handbag Y",
    category: "Fashion",
    registrationDate: "2024-02-19",
    verifications: 189,
    status: "active",
    image: "/placeholder-bag.jpg",
    description: "Handcrafted leather handbag with signature gold hardware and adjustable strap.",
  },
  {
    id: "PRD003",
    name: "Smartphone Z Pro",
    category: "Electronics",
    registrationDate: "2024-02-18",
    verifications: 567,
    status: "inactive",
    image: "/placeholder-phone.jpg",
    description: "Flagship smartphone with 6.7-inch OLED display and triple camera system.",
  },
  {
    id: "PRD004",
    name: "Limited Edition Sneakers",
    category: "Fashion",
    registrationDate: "2024-02-15",
    verifications: 328,
    status: "active",
    image: "/placeholder-sneakers.jpg",
    description: "Exclusive collaboration sneakers with premium materials and custom colorway.",
  },
  {
    id: "PRD005",
    name: "Premium Headphones",
    category: "Electronics",
    registrationDate: "2024-02-10",
    verifications: 412,
    status: "active",
    image: "/placeholder-headphones.jpg",
    description: "Noise-cancelling wireless headphones with premium audio technology.",
  },
  {
    id: "PRD006",
    name: "Designer Sunglasses",
    category: "Accessories",
    registrationDate: "2024-02-08",
    verifications: 156,
    status: "active",
    image: "/placeholder-sunglasses.jpg",
    description: "Polarized designer sunglasses with UV protection and signature branding.",
  },
];

export default function ProductCatalog() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
          <p className="text-muted-foreground">Manage and monitor your registered products</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Register New Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,180</div>
            <p className="text-xs text-muted-foreground">95.6% active rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-muted-foreground">+2.3K this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Verifications</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36.7</div>
            <p className="text-xs text-muted-foreground">per product</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Interface */}
      <Tabs defaultValue="table" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-4">
            <Input className="max-w-sm" placeholder="Search products..." />
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Table View Tab */}
        <TabsContent value="table">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Verifications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.registrationDate}</TableCell>
                    <TableCell>{product.verifications}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Product</DropdownMenuItem>
                          <DropdownMenuItem>View Verifications</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Grid View Tab */}
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="bg-muted h-48 flex items-center justify-center">
                  <span className="text-muted-foreground">Product Image</span>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>{product.category}</CardDescription>
                    </div>
                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                      {product.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">ID</p>
                        <p className="text-sm text-muted-foreground">{product.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Registered</p>
                        <p className="text-sm text-muted-foreground">{product.registrationDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Verifications</p>
                        <p className="text-sm text-muted-foreground">{product.verifications}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">View</Button>
                      <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-10 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>View Verifications</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}