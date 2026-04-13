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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const actionFormSchema = z.object({
    name: z.string().min(2, { message: "Action name must be at least 2 characters." }),
    module_id: z.string().min(1, { message: "Please select a module" }),
    description: z.string().optional(),
})

export default function ActionForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [modules, setModules] = useState<any[]>([])

    const form = useForm<z.infer<typeof actionFormSchema>>({
        resolver: zodResolver(actionFormSchema),
        defaultValues: {
            name: "",
            module_id: "",
            description: "",
        },
        mode: "onChange",
    })

    useEffect(() => {
        fetchModules()
    }, [])

    const fetchModules = async () => {
        try {
            const res = await fetch("/api/modules/get")
            const result = await res.json()
            if (result.success) {
                setModules(result.modules || result.data || [])
            } else {
                setModules([])
            }
        } catch (error) {
            console.error(error)
            setModules([])
        }
    }

    async function onSubmit(data: z.infer<typeof actionFormSchema>) {
        setLoading(true)
        try {
            const res = await fetch("/api/actions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (result.success) {
                alert("Action created successfully!")
                form.reset()
                router.refresh()
                router.push("/dashboard/actions/list")
            } else {
                alert(result.message || "Failed to create action")
            }
        } catch (error) {
            console.error(error)
            alert("Error creating action")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 max-w-xl p-8 rounded-xl bg-white">
                <h1 className="text-center text-xl font-semibold">Create Action</h1>

                <FormField
                    control={form.control}
                    name="module_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Module</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a module" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {modules.map((module) => (
                                        <SelectItem key={module._id} value={module._id}>
                                            {module.page_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Action Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Create, Read, Update, Delete" {...field} />
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
                                <Textarea placeholder="Action description..." {...field} />
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
                        {loading ? "Creating..." : "Create Action"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
