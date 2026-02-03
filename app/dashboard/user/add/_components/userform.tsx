"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"



const profileFormSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }).max(30, { message: "Username must not be longer than 30 characters.", }),
    email: z.string().min(2, { message: "Please select an email to display." }),
    role: z.string()

})



export default function UserForm() {
    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: "",
            email: "",
            role: "",
        },
        mode: "onChange",
    })
    function onSubmit(data: z.infer<typeof profileFormSchema>) {
        console.log(data)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 max-w-xl p-8 rounded-xl bg-white">
                <h1 className="text-center text-xl">Add User</h1>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Name" {...field} />
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
                                <Input
                                    placeholder="your.email@example.com"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Role"
                                    type="text"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-2 items-center">
                    <Button variant={'outline'}>Cancel</Button>
                    <Button className="bg-zinc-700" type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    )
}