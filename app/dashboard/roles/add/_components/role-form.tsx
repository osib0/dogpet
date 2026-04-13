"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useState } from "react"

const roleFormSchema = z.object({
    name: z.string().min(2, { message: "Role name must be at least 2 characters." }),
    description: z.string().optional(),
})

export default function RoleForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof roleFormSchema>>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            name: "",
            description: "",
        },
        mode: "onChange",
    })

    async function onSubmit(data: z.infer<typeof roleFormSchema>) {
        setLoading(true)
        try {
            const res = await fetch("/api/roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (result.success) {
                alert("Role created successfully!")
                form.reset()
                router.refresh()
                router.push("/dashboard/roles/list")
            } else {
                alert(result.message || "Failed to create role")
            }
        } catch (error) {
            console.error(error)
            alert("Error creating role")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 max-w-xl p-8 rounded-xl bg-white">
                <h1 className="text-center text-xl font-semibold">Create Role</h1>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Admin, Editor, Viewer" {...field} />
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
                                <Textarea placeholder="Role description..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2 items-center">
                    <Button variant={'outline'} type="button" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button className="bg-zinc-700" type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Role"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
