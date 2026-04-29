"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitUploadNetworkError,
  ImageKitServerError,
} from "@imagekit/next";

interface UserProfile {
  name: string;
  profileImage?: string;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export default function ProfileModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { data: session, refetch: refetchSession } =
    authClient.useSession();

  const user = session?.user as any;

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    profileImage: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    if (open && user) {
      setProfile({
        name: user.name ?? "",
        profileImage: user.image ?? "",
      });
      setSelectedFile(null);
      setError(null);
    }
  }, [open, user]);

  /* ---------------- IMAGEKIT AUTH ---------------- */

  const authenticator = async () => {
    const res = await fetch("/api/upload-auth");
    if (!res.ok) throw new Error("Auth failed");
    return res.json();
  };

  /* ---------------- SAVE PROFILE ---------------- */

  const updateProfile = async () => {
    if (!profile.name.trim()) {
      setError("Name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl = profile.profileImage;

      if (selectedFile) {
        const auth = await authenticator();

        const ext = selectedFile.type.split("/")[1]; // jpg / png / webp

        const uploadRes = await upload({
          ...auth,
          file: selectedFile,
          fileName: `profile_${Date.now()}.${ext}`, // IMPORTANT
        });

        if (!uploadRes.url) {
          throw new Error("Image upload failed");
        }

        imageUrl = uploadRes.url;
      }

      await authClient.updateUser({
        name: profile.name,
        image: imageUrl,
      });

      await refetchSession();
      toast.success("Profile updated");

      onOpenChange(false);
    } catch (err) {
      let msg = "Update failed";

      if (err instanceof ImageKitAbortError) msg = "Upload aborted";
      else if (err instanceof ImageKitInvalidRequestError) msg = "Invalid upload";
      else if (err instanceof ImageKitUploadNetworkError) msg = "Network error";
      else if (err instanceof ImageKitServerError) msg = "Server error";
      else if (err instanceof Error) msg = err.message;

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Update your name and profile picture
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <X className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-40 w-40 border border-[#16b674bf]">
                <AvatarImage
                  src={profile.profileImage || session?.user?.image || ""}
                />
                <AvatarFallback className="text-2xl uppercase bg-primary text-primary-foreground">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-white shadow-xl rounded-2xl"
                onClick={() => fileInputRef.current?.click()}
              >
                Update
              </Button>
            </div>

            <Input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (!ALLOWED_TYPES.includes(file.type)) {
                  toast.error("Only JPG, PNG, WEBP images allowed");
                  return;
                }

                setSelectedFile(file);

                // Preview (no base64)
                setProfile((p) => ({
                  ...p,
                  profileImage: URL.createObjectURL(file),
                }));
              }}
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-xs">Full Name</Label>
            <Input
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              placeholder="Enter your name"
            />
          </div>

          <Button
            onClick={updateProfile}
            disabled={loading}
            size={'sm'} className="text-xs"
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
