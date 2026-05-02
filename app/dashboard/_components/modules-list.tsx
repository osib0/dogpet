"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Module {
  _id: string;
  page_name: string;
  status: "ACTIVE" | "INACTIVE";
  description?: string;
  createdAt: string;
}

export function ModulesList() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/modules/get");
      const data = await response.json();
      if (data.success) {
        setModules(data.modules);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch modules");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this module?")) {
      try {
        const response = await fetch("/api/modules/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        if (data.success) {
          setModules(modules.filter((m) => m._id !== id));
        } else {
          setError(data.error);
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <Card className="w-full max-w-7xl mt-5 shadow-none rounded-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Modules</CardTitle>
        <Link href="/dashboard/modules/add">
          <Button className="gap-2 shadow-none text-black text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer">
            <Plus className="w-4 h-4" /> Add Module
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">Loading modules...</p>
          </div>
        ) : modules.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-gray-500 mb-4">No modules found</p>
            <Link href="/dashboard/modules/add">
              <Button className="shadow-none text-black text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer">Create First Module</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module._id}>
                    <TableCell className="font-medium">
                      {module.page_name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          module.status === "ACTIVE" ? "default" : "secondary"
                        }
                      >
                        {module.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {module.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/modules/edit/${module._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(module._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
