"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ModuleFormProps {
  moduleId?: string;
}

interface Module {
  _id: string;
  page_name: string;
  status: "ACTIVE" | "INACTIVE";
  description?: string;
}

export function ModuleForm({ moduleId }: ModuleFormProps) {
  const [formData, setFormData] = useState({
    page_name: "",
    status: "ACTIVE",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (moduleId) {
      fetchModule();
    }
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      const response = await fetch("/api/modules/get");
      const data = await response.json();
      if (data.success) {
        const module = data.modules.find((m: Module) => m._id === moduleId);
        if (module) {
          setFormData({
            page_name: module.page_name,
            status: module.status,
            description: module.description || "",
          });
        }
      }
    } catch (err: any) {
      setError("Failed to fetch module");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as "ACTIVE" | "INACTIVE" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const endpoint = moduleId
        ? "/api/modules/update"
        : "/api/modules/add";
      const method = moduleId ? "PUT" : "POST";

      const payload = moduleId
        ? { id: moduleId, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          page_name: "",
          status: "ACTIVE",
          description: "",
        });
        setTimeout(() => {
          router.push("/dashboard/modules/list");
        }, 1000);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {moduleId ? "Edit Module" : "Add New Module"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
              Module {moduleId ? "updated" : "added"} successfully!
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="page_name">Page Name *</Label>
            <Input
              id="page_name"
              name="page_name"
              value={formData.page_name}
              onChange={handleChange}
              placeholder="Enter page name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter module description (optional)"
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading
                ? "Saving..."
                : moduleId
                ? "Update Module"
                : "Add Module"}
            </Button>
            <Link href="/dashboard/modules/list" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
