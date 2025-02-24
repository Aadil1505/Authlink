import { authCheck } from "@/lib/actions/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Page() {
  await authCheck();

  const mockData = [
    { trend: "Increasing Sales", description: "Sales have been increasing steadily over the past quarter." },
    { trend: "High Verification Rates", description: "Verification rates are at an all-time high." },
    { trend: "Low Fraud Incidents", description: "Fraud incidents have decreased significantly." },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Market Trends</h1>
      <Card>
        <CardHeader>
          <CardTitle>Current Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trend</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.trend}</TableCell>
                  <TableCell>{data.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}