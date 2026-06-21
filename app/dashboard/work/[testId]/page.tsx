import { notFound } from "next/navigation";
import { testsList } from "../page";
import { TestFormLayout, WidalForm, HaematologyForm, GenericForm } from "../_components/test-forms";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = await params;
  const testId = resolvedParams.testId;
  const test = testsList.find(t => t.id === testId);

  if (!test) {
    notFound();
  }

  // Define form mappings
  const renderForm = () => {
    switch (testId) {
      case "a-widal":
        return <WidalForm />;
      case "b-haematology":
      case "h-haemogram": // Assuming Haemogram is similar/same as Haematology for this demo
        return <HaematologyForm />;
      case "c-bio-chemistry":
        return <GenericForm fields={["Blood Sugar Fasting", "Blood Sugar PP", "Urea", "Creatinine", "Uric Acid", "Calcium", "Phosphorus", "Total Protein", "Albumin"]} />;
      case "d-urine":
        return <GenericForm fields={["Color", "Appearance", "Specific Gravity", "pH", "Protein", "Glucose", "Ketones", "Bilirubin", "Urobilinogen", "Blood", "Leukocyte Esterase", "Nitrite", "Pus Cells", "RBCs", "Epithelial Cells", "Casts", "Crystals"]} />;
      case "e-stool":
        return <GenericForm fields={["Color", "Consistency", "Mucus", "Blood", "Ova", "Cysts", "Trophozoites", "Pus Cells", "RBCs", "Macrophages"]} />;
      case "f-lipid-profile":
        return <GenericForm fields={["Total Cholesterol", "Triglycerides", "HDL Cholesterol", "LDL Cholesterol", "VLDL Cholesterol", "Cholesterol/HDL Ratio", "LDL/HDL Ratio"]} />;
      case "g-semen":
        return <GenericForm fields={["Volume", "Color", "Viscosity", "Liquefaction Time", "pH", "Sperm Count", "Active Motility", "Sluggish Motility", "Non-Motile", "Normal Morphology", "Abnormal Morphology", "Pus Cells", "RBCs", "Epithelial Cells"]} />;
      case "i-liver-function":
        return <GenericForm fields={["Bilirubin Total", "Bilirubin Direct", "Bilirubin Indirect", "SGOT (AST)", "SGPT (ALT)", "Alkaline Phosphatase", "Total Protein", "Albumin", "Globulin", "A/G Ratio"]} />;
      case "j-fluid":
        return <GenericForm fields={["Fluid Type", "Appearance", "Total Cell Count", "Polymorphs", "Lymphocytes", "Protein", "Sugar", "ADA"]} />;
      case "k-mp-by-qbc":
        return <GenericForm fields={["Malarial Parasite", "Species", "Parasite Count"]} />;
      case "p-sputum":
        return <GenericForm fields={["Appearance", "AFB Stain", "Gram Stain", "Pus Cells", "Epithelial Cells"]} />;
      case "q-vdrl-in-dillution":
        return <GenericForm fields={["VDRL Result", "Dilution (if reactive)", "Titer"]} />;
      case "r-culture":
        return <GenericForm fields={["Specimen", "Organism Isolated", "Colony Count", "Antibiotic Sensitivity (Sensitive)", "Antibiotic Sensitivity (Resistant)", "Antibiotic Sensitivity (Intermediate)"]} />;
      case "s-rhanit-titre":
        return <GenericForm fields={["RA Factor", "Titre"]} />;
      case "t-fnac":
        return <GenericForm fields={["Site of Aspiration", "Gross Appearance", "Microscopic Examination", "Impression/Diagnosis"]} />;
      default:
        // Generic fallback with some standard fields
        return <GenericForm fields={["Test Value 1", "Test Value 2", "Observation", "Result", "Normal Range"]} />;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/work">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Data Entry</h2>
      </div>

      <TestFormLayout title={test.name}>
        {renderForm()}
      </TestFormLayout>
    </div>
  );
}
