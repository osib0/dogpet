import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface TestFormProps {
  title: string;
}

export function TestFormLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <Card className="w-full max-w-5xl mx-auto shadow-md">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="text-xl font-semibold text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Common Header Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 bg-muted/30 p-4 rounded-md border">
          <div className="space-y-1">
            <Label>Computer Code</Label>
            <Input defaultValue="0" />
          </div>
          <div className="space-y-1 lg:col-span-2">
            <Label>Name</Label>
            <Input placeholder="Patient Name" />
          </div>
          <div className="space-y-1">
            <Label>Age</Label>
            <Input placeholder="Age" />
          </div>
          <div className="space-y-1">
            <Label>Sex</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="F">Female</SelectItem>
                <SelectItem value="O">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Date</Label>
            <Input type="date" />
          </div>
          <div className="space-y-1 lg:col-span-2 xl:col-span-3">
            <Label>Ref. Dr.</Label>
            <Input placeholder="Referred By" />
          </div>
        </div>

        {/* Specific Form Fields */}
        <div className="border rounded-md p-4 bg-card">
          {children}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 border-t flex flex-wrap gap-2 justify-center p-4">
        <Button variant="default">Save</Button>
        <Button variant="outline">Edit</Button>
        <Button variant="outline">Print</Button>
        <Button variant="secondary">Cancel</Button>
      </CardFooter>
    </Card>
  );
}

export function WidalForm() {
  const dilutions = ["1/20", "1/40", "1/80", "1/160", "1/320"];
  const antigens = ["TO", "TH", "AH", "BH"];

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 font-semibold text-muted-foreground w-24">DILUTION</th>
              {dilutions.map(d => <th key={d} className="p-2 font-medium text-center">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {antigens.map(antigen => (
              <tr key={antigen} className="border-t">
                <td className="p-2 font-medium bg-muted/50 rounded-l-md text-center">{antigen}</td>
                {dilutions.map(d => (
                  <td key={`${antigen}-${d}`} className="p-2 text-center">
                    <Checkbox id={`${antigen}-${d}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        <Label>REMARK</Label>
        <Textarea rows={4} className="resize-none" />
      </div>

      <div className="flex items-center gap-4 max-w-sm">
        <Label className="whitespace-nowrap font-medium bg-muted/50 p-2 rounded-md">Report By :</Label>
        <Input />
      </div>
    </div>
  );
}

export function HaematologyForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
      {/* Column 1 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="w-16 font-semibold">Hb</Label>
          <Input className="w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Label className="w-16 font-semibold">TLC</Label>
          <Input className="w-24" />
        </div>
        <div className="space-y-2 mt-4 p-3 border rounded-md bg-muted/10">
          <Label className="font-semibold text-lg block border-b pb-1 mb-2">DLC :-</Label>
          {["Neut", "Lym.", "Mono", "Eos.", "Baso."].map(item => (
            <div key={item} className="flex items-center gap-2">
              <Label className="w-16 text-muted-foreground">{item}</Label>
              <Input className="w-24" />
            </div>
          ))}
        </div>
        
        <div className="pt-4 space-y-3">
            {["E.S.R", "AEC", "TROPONIN-I", "URINE ALBUMIN", "URINE SUGAR", "R.B.C"].map(item => (
                 <div key={item} className="flex items-center justify-between gap-2">
                 <Label className="text-xs font-semibold">{item}</Label>
                 <Input className="w-24" />
               </div>
            ))}
        </div>
      </div>

      {/* Column 2 */}
      <div className="space-y-4">
        <div className="flex gap-2 text-xs font-semibold text-muted-foreground mb-1">
          <div className="w-16"></div>
          <div className="w-16 text-center">MIN</div>
          <div className="w-16 text-center">Sec.</div>
        </div>
        <div className="flex items-center gap-2">
          <Label className="w-16">B.T</Label>
          <Input className="w-16" />
          <Input className="w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Label className="w-16">C.T</Label>
          <Input className="w-16" />
          <Input className="w-16" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Label className="w-16 font-semibold">H.C.V.</Label>
          <Input className="w-24" />
        </div>

        <div className="pt-8 space-y-3">
             <div className="flex items-center gap-2">
                <Label className="w-24 text-xs font-semibold">M.T.</Label>
                <Input className="flex-1" />
            </div>
            <div className="flex items-center gap-2">
                <Label className="w-24 text-xs font-semibold">M.P ANTIGEN</Label>
                <Input className="flex-1" />
            </div>
            <div className="flex items-center gap-2">
                <Label className="w-24 text-xs font-semibold">M.P ANTIBODY</Label>
                <Input className="flex-1" />
            </div>
             <div className="flex items-center gap-2">
                <Label className="w-24 text-xs font-semibold">M.P</Label>
                <Input className="flex-1" />
            </div>
        </div>

        <div className="pt-4 space-y-3">
             {["C-REC. PROETIN", "R. A. TEST", "ASO TITRE"].map(item => (
                 <div key={item} className="flex items-center justify-between gap-2">
                 <Label className="text-xs font-semibold">{item}</Label>
                 <Input className="w-24" />
               </div>
            ))}
        </div>
      </div>

      {/* Column 3 */}
      <div className="space-y-4 lg:col-span-2">
        <div className="flex flex-wrap gap-4 items-end border-b pb-4">
            <div className="space-y-2">
               <Label className="font-semibold bg-primary/10 px-2 py-1 rounded">P.T</Label>
               <div className="flex items-center gap-2"><Label className="w-10 text-xs">TEST</Label><Input className="w-20" /></div>
               <div className="flex items-center gap-2"><Label className="w-10 text-xs">Cont.</Label><Input className="w-20" /></div>
            </div>
            <div className="space-y-2">
               <Label className="text-xs block text-muted-foreground">I.N.R. OF PATIENT</Label>
               <Input className="w-48" />
               <Input className="w-48" />
            </div>
        </div>

        <div className="flex flex-wrap gap-4 items-end border-b pb-4">
            <div className="space-y-2">
               <Label className="font-semibold bg-primary/10 px-2 py-1 rounded">APTT</Label>
               <div className="flex items-center gap-2"><Label className="w-10 text-xs">TEST</Label><Input className="w-20" /></div>
               <div className="flex items-center gap-2"><Label className="w-10 text-xs">Cont.</Label><Input className="w-20" /></div>
            </div>
            <div className="flex items-center gap-4 pt-6">
                <div className="space-y-2 text-center">
                    <Label className="font-semibold">C. R. TIME</Label>
                    <Input className="w-24" />
                </div>
                <div className="space-y-2 text-center">
                    <Label className="font-semibold">HB.s Ag.</Label>
                    <Input className="w-24" />
                </div>
            </div>
        </div>

        <div className="flex gap-4 border-b pb-4">
             <div className="space-y-2">
                <Label className="font-semibold">Platelet Count</Label>
                <Input className="w-32" />
             </div>
             <div className="space-y-2 flex-1">
                <Label className="font-semibold">H.I.V</Label>
                <Input className="w-full" />
             </div>
        </div>

        <div className="flex gap-4 border-b pb-4">
             <div className="space-y-2 flex-1">
                <Label className="font-semibold">S.V.D.R.L</Label>
                <Input className="w-full" />
             </div>
             <div className="space-y-2">
                <Label className="font-semibold">B.Group</Label>
                <Input className="w-24" />
             </div>
             <div className="space-y-2">
                <Label className="font-semibold">RH</Label>
                <Input className="w-24" />
             </div>
        </div>

        <div className="space-y-2">
            <Label className="font-semibold">P.B.F</Label>
            <div className="flex gap-2">
                <Textarea rows={3} className="flex-1 resize-none" />
                <Button variant="outline" className="h-auto">CANCEL PBF</Button>
            </div>
        </div>

      </div>
    </div>
  );
}

export function GenericForm({ fields }: { fields: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fields.map((field, i) => (
        <div key={i} className="space-y-2">
          <Label className="font-medium text-sm">{field}</Label>
          <Input placeholder={`Enter ${field}`} />
        </div>
      ))}
      <div className="col-span-full space-y-2 mt-4 border-t pt-4">
         <Label className="font-medium">Remarks / Additional Notes</Label>
         <Textarea rows={3} />
      </div>
    </div>
  );
}
