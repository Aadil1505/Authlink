"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { type NfcTagRegistrationResponse, registerNfcTag } from "@/lib/actions/registration"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, AlertCircle } from "lucide-react"

// Define the form schema with Zod
const formSchema = z.object({
  productId: z
    .string()
    .min(1, "Product ID is required")
    .regex(/^[a-zA-Z0-9-]+$/, "Product ID must be alphanumeric"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  manufacturerId: z
    .string()
    .min(1, "Manufacturer ID is required")
    .regex(/^[a-zA-Z0-9-]+$/, "Manufacturer ID must be alphanumeric"),
})

type FormValues = z.infer<typeof formSchema>

export default function RegisterNfcTag() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<(NfcTagRegistrationResponse & { success: true }) | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      name: "",
      description: "",
      manufacturerId: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true)
      setError(null)

      // Call the server action with form values
      const response = await registerNfcTag()

      if (response.success) {
        setResult(response)
      } else {
        setError(response.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>NFC Tag Registration</CardTitle>
          <CardDescription>Register and personalize your NTAG424 DNA tag with product information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product ID</FormLabel>
                    <FormControl>
                      <Input placeholder="PRD-12345" {...field} />
                    </FormControl>
                    <FormDescription>Enter the unique identifier for this product</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Smart Device X1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description..."
                        className="resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer ID</FormLabel>
                    <FormControl>
                      <Input placeholder="MFR-789" {...field} />
                    </FormControl>
                    <FormDescription>The ID of the manufacturer for this product</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register NFC Tag"}
              </Button>
            </form>
          </Form>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                {error === "No card detected" && (
                  <p className="mt-2 text-sm">Please place an NFC tag on the reader and try again.</p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert
              variant="default"
              className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
            >
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                <p>Tag has been registered with product information.</p>
                <div className="mt-2 space-y-1">
                  <p>
                    <span className="font-medium">UID:</span> {result.uid}
                  </p>
                  {/* <p>
                    <span className="font-medium">Product:</span> {result.productName}
                  </p> */}
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {result.isFactory ? "Factory tag personalized" : "Tag written"}
                  </p>
                  <p>
                    <span className="font-medium">Message:</span> {result.message}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
          <p>Fill in the product details, place an NTAG424 DNA tag on the reader, then submit the form.</p>
          <p className="mt-1">This will personalize the tag with product information and a verification URL.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
