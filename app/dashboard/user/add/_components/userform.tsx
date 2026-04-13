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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const profileFormSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }).max(30, { message: "Username must not be longer than 30 characters." }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    role_id: z.string().optional(),
})

interface Role {
    _id: string
    name: string
}

export default function UserForm() {
    const router = useRouter()
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            role_id: "",
        },
        mode: "onChange",
    })

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        try {
            const res = await fetch("/api/roles")
            const data = await res.json()
            if (data.success) {
                setRoles(data.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function onSubmit(data: z.infer<typeof profileFormSchema>) {
        setLoading(true)
        try {
            // Create user in database with auth integration
            const res = await fetch("/api/users-management", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                }),
            })

            const result = await res.json()

            if (result.success) {
                const userId = result.data._id

                // If role is selected, assign it to the user
                if (data.role_id) {
                    try {
                        const roleRes = await fetch("/api/user-roles", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                user_id: userId,
                                role_id: data.role_id,
                            }),
                        })
                        const roleResult = await roleRes.json()
                        if (roleResult.success) {
                            alert("User created and role assigned successfully!")
                        } else {
                            alert("User created but role assignment failed: " + roleResult.message)
                        }
                    } catch (error) {
                        console.error(error)
                        alert("User created but role assignment failed")
                    }
                } else {
                    alert("User created successfully!")
                }

                form.reset()
                router.refresh()
                router.push("/dashboard/user/list")
            } else {
                alert(result.message || "Failed to create user")
            }
        } catch (error) {
            console.error(error)
            alert("Error creating user")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 max-w-xl p-8 rounded-xl bg-white">
                <h1 className="text-center text-xl font-semibold">Add User</h1>

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="your.email@example.com" type="email" {...field} />
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
                                <Input placeholder="Enter password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assign Role (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role._id} value={role._id}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2 items-center">
                    <Button variant={'outline'} type="button" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button className="bg-zinc-700" type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create User"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
