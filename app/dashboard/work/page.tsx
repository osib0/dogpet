import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

export const testsList = [
  { id: "a-widal", name: "A - WIDAL" },
  { id: "b-haematology", name: "B - Haematology" },
  { id: "c-bio-chemistry", name: "C - Bio- Chemistry" },
  { id: "d-urine", name: "D - Urine" },
  { id: "e-stool", name: "E - Stool" },
  { id: "f-lipid-profile", name: "F - LIPID PROFILE" },
  { id: "g-semen", name: "G - SEMEN" },
  { id: "h-haemogram", name: "H - HAEMOGRAM" },
  { id: "i-liver-function", name: "I - LIVER FUNCTION" },
  { id: "j-fluid", name: "J - Fluid" },
  { id: "k-mp-by-qbc", name: "K - MP BY Q.B.C" },
  { id: "l-others-report", name: "L - Others Report" },
  { id: "other-report", name: "Other Report" },
  { id: "n-bone-marrow", name: "N - Bone Marrow" },
  { id: "o-bonemarrow", name: "O - BoneMarrow" },
  { id: "p-sputum", name: "P - SPUTUM" },
  { id: "q-vdrl-in-dillution", name: "Q - VDRL IN DILLUTION" },
  { id: "r-culture", name: "R - CULTURE" },
  { id: "s-rhanit-titre", name: "S - RHANIT TITRE" },
  { id: "t-fnac", name: "T - Fnac" },
  { id: "u-bio-chemistry-normal", name: "U - Bio Chemistry Normal Value" },
  { id: "v-misc-normal", name: "V - MISC NORMAL VALUE" },
  { id: "w-hematology-normal", name: "W - Hematology Normal Value" },
  { id: "x-hemogram-normal", name: "X - HEMOGRAM NORMAL VALUE" },
  { id: "y-doctors-master", name: "Y - Doctor's Master" },
  { id: "z-reporting-doctor", name: "Z - Reporting Doctor" },
];

export default function WorkPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Work</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {testsList.map((test) => (
          <Link key={test.id} href={`/dashboard/work/${test.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-l-4 border-l-primary h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {test.name}
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Click to open test form
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
