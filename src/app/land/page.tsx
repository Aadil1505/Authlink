// app/page.tsx - Landing Page
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Shield, Smartphone, Lock, BarChart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center bg-primary/5">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
          Authenticate Products with a Tap
        </h1>
        <p className="max-w-[600px] mt-4 text-muted-foreground text-lg">
          Secure blockchain-based product authentication using NFC technology. 
          Protect your brand and customers from counterfeits.
        </p>
        <div className="flex gap-4 mt-8">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            Why Choose AuthLink?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-2" />
                <CardTitle>Tamper-Proof</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Blockchain-secured product data that cannot be altered or forged
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <Smartphone className="w-12 h-12 text-primary mb-2" />
                <CardTitle>One-Tap Verify</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Instant verification using just your smartphone's NFC reader
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <Lock className="w-12 h-12 text-primary mb-2" />
                <CardTitle>Military-Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AES-128 encryption and dynamic challenge-response security
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <BarChart className="w-12 h-12 text-primary mb-2" />
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Real-time insights into product verification and potential fraud
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}