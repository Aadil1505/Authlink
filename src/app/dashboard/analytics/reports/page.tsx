import { getReports, type Report } from "@/lib/actions/reports";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function ReportsPage() {
  const reports = await getReports();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Reports</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex flex-col space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{report.title}</h3>
                </div>
                <p className="text-sm text-gray-500">{report.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Created: {new Date(report.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

