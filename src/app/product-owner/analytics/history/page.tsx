// import { authCheck } from "@/lib/actions/auth";

// export default async function Page() {
//     await authCheck()
//   return (
//     <div className="container mx-auto py-10">
//       {/* <EmployeForm /> */}
//     </div>
//   )
// }

// app/verification-history/page.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Search, 
  Download,
  Filter
} from "lucide-react";

// Sample verification data
const verifications = [
  {
    id: "vrf-001",
    productName: "Luxury Watch Model X",
    productId: "PRD001",
    date: "Feb 24, 2025",
    time: "10:32 AM",
    location: "New York, USA",
    status: "authentic",
    device: "iPhone 15 Pro",
  },
  {
    id: "vrf-002",
    productName: "Luxury Watch Model X",
    productId: "PRD001",
    date: "Feb 20, 2025",
    time: "3:15 PM",
    location: "New York, USA",
    status: "authentic",
    device: "iPhone 15 Pro",
  },
  {
    id: "vrf-003",
    productName: "Designer Handbag Y",
    productId: "PRD002",
    date: "Feb 18, 2025",
    time: "1:45 PM",
    location: "Chicago, USA",
    status: "authentic",
    device: "Samsung Galaxy S23",
  },
  {
    id: "vrf-004",
    productName: "Designer Handbag Y",
    productId: "PRD002",
    date: "Feb 10, 2025",
    time: "11:22 AM",
    location: "Unknown",
    status: "suspicious",
    device: "Unknown Device",
  },
  {
    id: "vrf-005",
    productName: "Collectible Sneakers Z",
    productId: "PRD003",
    date: "Jan 30, 2025",
    time: "5:17 PM",
    location: "Los Angeles, USA",
    status: "counterfeit",
    device: "Google Pixel 7",
  },
];

// Sample owned products
const ownedProducts = [
  {
    id: "PRD001",
    name: "Luxury Watch Model X",
    brand: "LuxBrand",
    purchaseDate: "Jan 15, 2025",
    image: "/placeholder-watch.jpg",
    verifications: 2,
    status: "authentic"
  },
  {
    id: "PRD002",
    name: "Designer Handbag Y",
    brand: "FashionCo",
    purchaseDate: "Dec 25, 2024",
    image: "/placeholder-bag.jpg",
    verifications: 2,
    status: "suspicious"
  },
  {
    id: "PRD003",
    name: "Collectible Sneakers Z",
    brand: "SportStyle",
    purchaseDate: "Jan 5, 2025",
    image: "/placeholder-sneakers.jpg",
    verifications: 1,
    status: "counterfeit"
  }
];

export default function VerificationHistory() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Verified Products</h1>
          <p className="text-muted-foreground">Track the authenticity of your products</p>
        </div>
        <Button>
          <CheckCircle className="mr-2 h-4 w-4" />
          Verify New Product
        </Button>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="history">Verification History</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="bg-muted h-48 flex items-center justify-center">
                  <span className="text-muted-foreground">Product Image</span>
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.brand}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge
                        variant={
                          product.status === 'authentic' ? 'default' :
                          product.status === 'suspicious' ? 'outline' :
                          'destructive'
                        }
                      >
                        {product.status === 'authentic' ? (
                          <><CheckCircle className="mr-1 h-3 w-3" /> Authentic</>
                        ) : product.status === 'suspicious' ? (
                          <><AlertTriangle className="mr-1 h-3 w-3" /> Suspicious</>
                        ) : (
                          <><XCircle className="mr-1 h-3 w-3" /> Counterfeit</>
                        )}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Purchase Date</span>
                      <span className="text-sm">{product.purchaseDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Verifications</span>
                      <span className="text-sm">{product.verifications} times</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Verification History</CardTitle>
              <CardDescription>
                Track all authenticity checks performed on your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search verifications..." className="pl-8" />
                </div>
                <Button variant="outline" className="shrink-0">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" className="shrink-0">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Device</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verifications.map((verification) => (
                      <TableRow key={verification.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>{verification.productName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{verification.productName}</span>
                              <span className="text-xs text-muted-foreground">{verification.productId}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span>{verification.date}</span>
                              <span className="text-xs text-muted-foreground">{verification.time}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{verification.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              verification.status === 'authentic' ? 'default' :
                              verification.status === 'suspicious' ? 'outline' :
                              'destructive'
                            }
                          >
                            {verification.status === 'authentic' ? (
                              <><CheckCircle className="mr-1 h-3 w-3" /> Authentic</>
                            ) : verification.status === 'suspicious' ? (
                              <><AlertTriangle className="mr-1 h-3 w-3" /> Suspicious</>
                            ) : (
                              <><XCircle className="mr-1 h-3 w-3" /> Counterfeit</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{verification.device}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}