// app/verification/[uid]/page.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductByUid } from "@/lib/actions/verify";
import { CheckCircle, ShoppingBag, Shield, Calendar, Factory, Tag, ArrowLeft, Download, Share2 } from 'lucide-react';
import Link from 'next/link';

type Params = Promise<{ uid: string }>



export default async function ProductDetailsPage(props: {
  params: Params
}) {

    const params = await props.params
    const uid = params.uid

  const { product, error } = await getProductByUid(uid);
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/30">
        <Card className="w-full max-w-md border shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="rounded-full mx-auto bg-destructive/10 p-3 w-fit mb-4">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "We couldn't find any product associated with this identifier."}
            </p>
            <Button asChild>
              <Link href="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Verification
          </Link>
          <Badge variant="outline" className="flex items-center">
            <Shield className="mr-1 h-3.5 w-3.5 text-primary" />
            <span className="text-xs">Verified Authentic</span>
          </Badge>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Product Image */}
          <div className="flex flex-col space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted/30">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="object-cover w-full h-full"
                loading="eager"
              />
            </div>
            <div className="flex justify-center space-x-2">
              <Button variant="outline" size="sm" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Certificate
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <div className="flex items-center mt-2 space-x-2">
                <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-1 h-3 w-3" /> Authentic
                </Badge>
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="secondary">{product.price}</Badge>
              </div>
            </div>
            
            <p className="text-muted-foreground">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Factory className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Manufacturer</p>
                  <p className="text-sm text-muted-foreground">{product.manufacturer}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Manufacture Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(product.manufactureDate)}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Product ID</p>
                  <p className="text-sm font-mono text-muted-foreground">{product.id}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ShoppingBag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">{product.price}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Tabs defaultValue="features" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="pt-4">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="specifications" className="pt-4">
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-2 py-2 border-b last:border-0">
                        <dt className="text-sm font-medium">{key}</dt>
                        <dd className="text-sm text-muted-foreground">{value}</dd>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="verification" className="pt-4">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                        <Shield className="h-5 w-5 text-green-600 dark:text-green-300" />
                      </div>
                      <div>
                        <h4 className="font-medium">Verification Details</h4>
                        <p className="text-sm text-muted-foreground">
                          This product was verified at {new Date().toLocaleTimeString()} on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Product Authenticity</p>
                          <p className="text-sm text-muted-foreground">This product has been verified as authentic using our secure cryptographic verification system.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Supply Chain Integrity</p>
                          <p className="text-sm text-muted-foreground">Product tracking confirms this item followed the authorized distribution channel from manufacturer to retailer.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Tamper Detection</p>
                          <p className="text-sm text-muted-foreground">No signs of tampering detected. Product sealed and secured as intended by manufacturer.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Authlink Verification System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}