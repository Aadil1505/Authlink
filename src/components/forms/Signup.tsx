"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { productOwnerSchema, type ProductOwnerFormValues } from "@/lib/schema"
import { addProductOwner } from "@/lib/actions/productOwner"
import Input_03 from "../kokonutui/input-03"

export default function SignupForm() {
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

      if (result.success) {
        toast({
          title: "Success",
          description: "Account created successfully!",
        })
        form.reset()
        router.replace("/login")
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "There was a problem with your request.",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again.",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex items-center justify-center rounded-md">
                <img src="/Logo.png" className="w-1/4" alt="Logo" />
              </div>
              <span className="sr-only">Authlink</span>
            </a>
            <h1 className="text-xl font-semibold">Create your Authlink account</h1>
          </div>
          
          <div className="flex flex-col gap-6">
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
                        disabled={isPending}
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
                        disabled={isPending}
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
                    <Input 
                      type="email" 
                      placeholder="batman@pride.hofstra.edu" 
                      {...field}
                      disabled={isPending}
                    />
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
                    <Input 
                      type="password" 
                      placeholder="********" 
                      {...field}
                      disabled={isPending}
                    />
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
              {isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
            </Button>
          </div>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="italic underline-offset-4">Login Here</a>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"></div>
        </form>
      </Form>
      
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}