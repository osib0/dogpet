// "use client";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { LogOut, User, BookOpen, History, Settings } from "lucide-react";
// import { authClient } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import AccountSettingsModal from "./account";


// export default function ProfileMenu() {
//   const router = useRouter();
//   const { data: session } = authClient.useSession();
//   const user = session?.user;

//   const [open, setOpen] = useState(false);

//   const handleLogout = async () => {
//     await authClient.signOut();
//     router.replace("/sign-in");
//   };

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <button className="flex items-center gap-2 border-t px-3 py-2 w-full hover:bg-muted">
//             <Avatar className="h-8 w-8">
//               <AvatarFallback className="bg-blue-500 text-white">
//                 {user?.name?.[0] ?? "U"}
//               </AvatarFallback>
//             </Avatar>
//             <span className="text-sm font-medium">{user?.name}</span>
//           </button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent className="w-64 rounded-xl" align="end">
//           <DropdownMenuLabel>
//             <p className="text-sm">{user?.name}</p>
//             <p className="text-xs text-muted-foreground">{user?.email}</p>
//           </DropdownMenuLabel>

//           <DropdownMenuSeparator />

//           <DropdownMenuItem onClick={() => router.push("/profile")}>
//             <User className="mr-2 h-4 w-4" />
//             My Profile
//           </DropdownMenuItem>

//           <DropdownMenuItem onClick={() => router.push("/my-books")}>
//             <BookOpen className="mr-2 h-4 w-4" />
//             My Issued Books
//           </DropdownMenuItem>

//           <DropdownMenuItem onClick={() => router.push("/borrow-history")}>
//             <History className="mr-2 h-4 w-4" />
//             Borrow History
//           </DropdownMenuItem>

//           <DropdownMenuItem onClick={() => setOpen(true)}>
//             <Settings className="mr-2 h-4 w-4" />
//             Account Settings
//           </DropdownMenuItem>

//           <DropdownMenuSeparator />

//           <DropdownMenuItem
//             onClick={handleLogout}
//             className="text-red-600 focus:text-red-600"
//           >
//             <LogOut className="mr-2 h-4 w-4" />
//             Logout
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* MODAL */}
//       <AccountSettingsModal open={open} onOpenChange={setOpen} />
//     </>
//   );
// }
