import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import DashboardHeader from "./_components/header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-[#f9f9f9] w-full">
        <DashboardHeader/>
        {children}
      </main>
    </SidebarProvider>
  );
}
