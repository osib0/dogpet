"use client"
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"

import { useState } from "react"

type AdminItem = {
    id: number
    title: string
    action: string[]
}

const AdminList = [
    { id: 1, title: "users", action: ["add", "list", "delete", "edit"] },
    //   { id: 2, title: "books management", action: ["add", "list", "delete", "edit"] },
    //   { id: 3, title: "orders", action: ["add", "list", "delete", "edit"] },
]


export default function Permissions() {
    const [selectedActions, setSelectedActions] = useState<any>({})

    const handleSelect = (itemId: number, action: string) => {
        setSelectedActions((prev: any) => ({
            ...prev,
            [String(itemId)]: action,
        }))
    }
    return (
        <div className=' max-w-[550px] w-full rounded-lg bg-white'>
            <div className='p-6 space-y-6'>
                <h1 className='text-center font-semibold text-2xl'>Assign Role Permissions</h1>
                <p className="text-sm text-[#737373] text-center">Select a user and review their assigned role permissions</p>
                <form className='space-y-4'>
                    <div>
                        <label className="tex">select user</label>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="apple">Admin</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="max-h-[300px] space-y-4 p-3 overflow-y-auto border mt-3 rounded-lg">
                            {AdminList.map((item) => (
                                <div key={item.id}>
                                    <p className="mb-2 font-medium">{item.title}</p>

                                    <RadioGroup
                                        className="flex gap-4"
                                        value={selectedActions[String(item.id)] || ""}
                                        onValueChange={(value) => handleSelect(item.id, value)}
                                    >
                                        {item.action.map((subItem, ind) => (
                                            <div className="flex items-center gap-2" key={ind}>
                                                <RadioGroupItem
                                                    value={subItem}
                                                    id={`${item.id}-${subItem}`}
                                                />
                                                <Label htmlFor={`${item.id}-${subItem}`}>{subItem}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-center text-sm text-[#737373]">No permissions found.</p>
                    <button className="text-center w-full bg-linear-to-r from-zinc-700 to-zinc-800 text-md rounded-md text-white py-2">save</button>
                </form>
            </div>
        </div>
    )
}
