import { authCheck } from "@/lib/actions/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Page() {
  await authCheck();

  const mockData = [
    { product: "Product A", verifications: 300 },
    { product: "Product B", verifications: 450 },
    { product: "Product C", verifications: 200 },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Verification History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Verification Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Verifications</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.product}</TableCell>
                  <TableCell>{data.verifications}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}