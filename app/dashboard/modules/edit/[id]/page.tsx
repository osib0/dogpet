import { ModuleForm } from "@/app/dashboard/_components/modules-form";

interface EditModulePageProps {
  params: {
    id: string;
  };
}

export default function EditModulePage({ params }: EditModulePageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold">Edit Module</h1>
        <p className="text-gray-600">Update module details</p>
      </div>
      <ModuleForm moduleId={params.id} />
    </div>
  );
}
