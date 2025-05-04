import { getVerificationMetrics, type VerificationMetric } from "@/lib/actions/verificationpage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function VerificationsPage() {
  const metrics = await getVerificationMetrics();

  const totalVerifications = metrics.length;
  const completedVerifications = metrics.filter(m => m.status === 'completed').length;
  const failedVerifications = metrics.filter(m => m.status === 'failed').length;
  const pendingVerifications = metrics.filter(m => m.status === 'pending').length;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Verification Analytics</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVerifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{completedVerifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{failedVerifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{pendingVerifications}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between">
                <span className="text-sm font-medium">{new Date(metric.created_at).toLocaleDateString()}</span>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm ${
                    metric.status === 'completed' ? 'text-green-500' :
                    metric.status === 'failed' ? 'text-red-500' :
                    'text-yellow-500'
                  }`}>
                    {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

