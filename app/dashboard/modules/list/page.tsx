import { ModulesList } from "@/app/dashboard/_components/modules-list";

export default function ModulesListPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold">Modules</h1>
        <p className="text-gray-600">Manage your dashboard modules</p>
      </div>
      <ModulesList />
    </div>
  );
}
