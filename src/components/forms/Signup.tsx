"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { addProductOwner } from "@/lib/actions/productOwner"
import { productOwnerSchema, type ProductOwnerFormValues } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import Input_03 from "../kokonutui/input-03"

export default function ProductOwnerForm() {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<ProductOwnerFormValues>({
    resolver: zodResolver(productOwnerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      profileImage: undefined,
    },
  })



  async function onSubmit(data: ProductOwnerFormValues) {
    setIsPending(true)
    try {
      const formData = new FormData()
      formData.append("firstName", data.firstName)
      formData.append("lastName", data.lastName)
      formData.append("email", data.email)
      formData.append("password", data.password)
      formData.append("profileImage", data.profileImage.file)
      

      const result = await addProductOwner(formData)

      if (result.error) {
        toast({
          variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        console.error(result.error)
        return
      }

      if (result.success) {
        toast({
            title: "Success",
            description: "Account created successfully!",
            // action: <ToastAction altText="View Profile" onClick={() => router.push(`/dashboard/find/search/${data.h700}`)}>View Profile</ToastAction>
        })
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          profileImage: undefined,
        })
        router.replace("/login")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      console.error("Failed to add employee. Please try again.")
      toast({
        variant: "destructive",
        title: "Error submitting form",
        description: "Failed to add employee. Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold">Add Employee</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Register a new employee to the MakerSpace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bruce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Wayne"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="batman@pride.hofstra.edu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="*****" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center">
                      <Input_03
                        onFileChange={(file, preview) => {
                          field.onChange({
                            file: file,
                            preview: preview,
                          })
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}