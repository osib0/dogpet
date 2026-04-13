import { ModuleForm } from "@/app/dashboard/_components/modules-form";

export default function AddModulePage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold">Add Module</h1>
        <p className="text-gray-600">Create a new module for your dashboard</p>
      </div>
      <ModuleForm />
    </div>
  );
}
