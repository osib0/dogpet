"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Role {
    _id: string
    name: string
}

interface Module {
    _id: string
    page_name: string
}

interface Action {
    _id: string
    name: string
}

interface Permission {
    _id: string
    role_id: string | { _id: string; name: string }
    module_id: string | { _id: string; page_name: string }
    action_ids: (string | { _id: string; name: string })[]
}

export default function PermissionsPage() {
    const [roles, setRoles] = useState<Role[]>([])
    const [modules, setModules] = useState<Module[]>([])
    const [actions, setActions] = useState<Action[]>([])
    const [permissions, setPermissions] = useState<Permission[]>([])

    const [selectedRole, setSelectedRole] = useState<string>("")
    const [selectedModule, setSelectedModule] = useState<string>("")
    const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        try {
            const [rolesRes, modulesRes, permissionsRes] = await Promise.all([
                fetch("/api/roles"),
                fetch("/api/modules/get"),
                fetch("/api/permissions"),
            ])

            const rolesData = await rolesRes.json()
            const modulesData = await modulesRes.json()
            const permissionsData = await permissionsRes.json()

            if (rolesData.success) setRoles(rolesData.data || [])
            if (modulesData.success) setModules(modulesData.modules || modulesData.data || [])
            if (permissionsData.success) setPermissions(permissionsData.data || [])
        } catch (error) {
            console.error(error)
            setRoles([])
            setModules([])
            setPermissions([])
        }
    }

    const handleRoleChange = (roleId: string) => {
        setSelectedRole(roleId)
        setSelectedModule("")
        setSelectedActions(new Set())
    }

    const handleModuleChange = async (moduleId: string) => {
        setSelectedModule(moduleId)
        setSelectedActions(new Set())

        // Fetch actions for this module
        try {
            const res = await fetch(`/api/actions?module_id=${moduleId}`)
            const data = await res.json()
            if (data.success) {
                setActions(data.data)
            }
        } catch (error) {
            console.error(error)
        }

        // Load existing permissions for this role-module combo
        // Need to convert IDs to strings for comparison
        const existingPermission = permissions.find((p: Permission) => {
            const pRoleId = typeof p.role_id === 'object' ? (p.role_id as any)._id : p.role_id
            const pModuleId = typeof p.module_id === 'object' ? (p.module_id as any)._id : p.module_id
            return pRoleId === selectedRole && pModuleId === moduleId
        })
        
        if (existingPermission && existingPermission.action_ids) {
            // Convert action_ids to strings for proper Set comparison
            const actionIds = existingPermission.action_ids.map((id: any) => 
                typeof id === 'object' ? id._id : id
            )
            setSelectedActions(new Set(actionIds))
        }
    }

    const handleActionToggle = (actionId: string) => {
        const newActions = new Set(selectedActions)
        if (newActions.has(actionId)) {
            newActions.delete(actionId)
        } else {
            newActions.add(actionId)
        }
        setSelectedActions(newActions)
    }

    const handleSavePermissions = async () => {
        if (!selectedRole || !selectedModule) {
            alert("Please select both role and module")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/permissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role_id: selectedRole,
                    module_id: selectedModule,
                    action_ids: Array.from(selectedActions),
                }),
            })

            const result = await res.json()

            if (result.success) {
                alert("Permissions saved successfully!")
                // Fetch fresh data and reload the current module's permissions
                try {
                    const permRes = await fetch("/api/permissions")
                    const permData = await permRes.json()
                    if (permData.success) {
                        setPermissions(permData.data || [])
                        // Reload current module to show saved permissions
                        const existingPermission = permData.data?.find((p: any) => {
                            const pRoleId = typeof p.role_id === 'object' ? p.role_id._id : p.role_id
                            const pModuleId = typeof p.module_id === 'object' ? p.module_id._id : p.module_id
                            return pRoleId === selectedRole && pModuleId === selectedModule
                        })
                        if (existingPermission && existingPermission.action_ids) {
                            const actionIds = existingPermission.action_ids.map((id: any) => 
                                typeof id === 'object' ? id._id : id
                            )
                            setSelectedActions(new Set(actionIds))
                        }
                    }
                } catch (error) {
                    console.error(error)
                }
            } else {
                alert(result.message || "Failed to save permissions")
            }
        } catch (error) {
            console.error(error)
            alert("Error saving permissions")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Manage Permissions</h1>

            <div className="bg-white rounded-lg p-6 space-y-6">
                {/* Select Role */}
                <div>
                    <Label className="text-base font-semibold mb-2 block">Select Role</Label>
                    <Select value={selectedRole} onValueChange={handleRoleChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role._id} value={role._id}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Select Module */}
                {selectedRole && (
                    <div>
                        <Label className="text-base font-semibold mb-2 block">Select Module</Label>
                        <Select value={selectedModule} onValueChange={handleModuleChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a module" />
                            </SelectTrigger>
                            <SelectContent>
                                {modules.map((module) => (
                                    <SelectItem key={module._id} value={module._id}>
                                        {module.page_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Actions */}
                {selectedModule && actions.length > 0 && (
                    <div>
                        <Label className="text-base font-semibold mb-4 block">Select Actions</Label>
                        <div className="border rounded-lg p-4">
                            {actions.map((action) => (
                                <div key={action._id} className="flex items-center gap-3 py-2">
                                    <Checkbox
                                        id={action._id}
                                        checked={selectedActions.has(action._id)}
                                        onCheckedChange={() => handleActionToggle(action._id)}
                                    />
                                    <Label htmlFor={action._id} className="cursor-pointer font-medium">
                                        {action.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Actions Message */}
                {selectedModule && actions.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        No actions available for this module
                    </div>
                )}

                {/* Save Button */}
                {selectedModule && (
                    <div className="flex gap-2">
                        <Button
                            onClick={handleSavePermissions}
                            disabled={loading}
                            className="bg-zinc-700"
                        >
                            {loading ? "Saving..." : "Save Permissions"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedModule("")
                                setSelectedActions(new Set())
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                )}
            </div>

            {/* Existing Permissions Table */}
            {selectedRole && (
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">Current Permissions for: {roles.find(r => r._id === selectedRole)?.name}</h2>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableHead>Module</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permissions
                                    .filter((p) => p.role_id === selectedRole)
                                    .map((permission) => {
                                        const module = modules.find((m) => m._id === permission.module_id)
                                        return (
                                            <TableRow key={permission._id}>
                                                <TableCell className="font-medium">
                                                    {module?.page_name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-2">
                                                        {permission.action_ids.map((actionItem) => {
                                                            const actionId = typeof actionItem === 'object' ? (actionItem as any)._id : actionItem
                                                            const actionName = typeof actionItem === 'object' ? (actionItem as any).name : actionItem
                                                            return (
                                                                <span
                                                                    key={actionId}
                                                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                                                                >
                                                                    {actionName}
                                                                </span>
                                                            )
                                                        })}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    )
}
