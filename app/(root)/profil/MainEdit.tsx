"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserData } from "@/index/prisma/types";
import { useUpdateProfileMutation } from "@/lib/mutations/profile.mutations";
import { Camera } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRef, useState, useEffect, useTransition } from "react";
import Resizer from "react-image-file-resizer";
import CropImageDialog from "./CropImageDialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  updatePasswordType,
  updateProfileType,
} from "@/index/validationTypes/types";
import { updatePasswordSchema, updateProfileSchema } from "@/lib/validators";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { changePassword } from "@/lib/actions/user.actions";
import { PasswordInput } from "@/components/form/ShadPasswordInput";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface MainEditProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MainEdit({ user, open, onOpenChange }: MainEditProps) {
  const [activeTab, setActiveTab] = useState("account");

  const accountForm = useForm<updateProfileType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
    },
  });
  const mutation = useUpdateProfileMutation(
    user.id,
    accountForm.setError,
    onOpenChange
  );

  const passwordForm = useForm<updatePasswordType>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const { clearErrors } = passwordForm;

  const [isPending, startTransition] = useTransition();

  const onSubmitP = (values: updatePasswordType) => {
    startTransition(async () => {
      const res = await changePassword(values, user.id);
      if (!res) {
        toast.error("La modification du mot de passe a échoué");
      }
      if (!res.success) {
        passwordForm.setError("currentPassword", { message: res.message });
      } else {
        toast.success(res.message);
        onOpenChange(false);
      }
    });
  };

  // Reset state when dialog closes
  useEffect(() => {
    if (open) {
      accountForm.reset({ name: user.name });
    } else {
      accountForm.reset({ name: user.name });
      passwordForm.reset();
    }
  }, [open, user.name]);

  async function onSubmit(value: updateProfileType) {
    mutation.mutate({
      value,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {/* Conditional DialogTitle based on active tab */}
          <DialogTitle className="text-blue-400">
            {activeTab === "account"
              ? "Modifier votre profil"
              : "Changer votre mot de passe"}
          </DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Profil</TabsTrigger>
            <TabsTrigger value="password">Mot de passe</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Compte</CardTitle>
                <CardDescription>
                  Modifiez votre nom. Cliquez sur enregistrer lorsque vous avez
                  terminé.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Form {...accountForm}>
                  <form className="space-y-3">
                    <FormField
                      control={accountForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  className="ml-3"
                  onClick={accountForm.handleSubmit(onSubmit)}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending
                    ? "Enregistrement en cours..."
                    : "Enregistrer"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Mot de passe</CardTitle>
                <CardDescription>
                  Changez votre mot de passe ici. Après l'enregistrement, vous
                  serez déconnecté.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Form for Password Change */}
                <Form {...passwordForm}>
                  <form
                    className="space-y-3"
                    onSubmit={passwordForm.handleSubmit(onSubmitP)} // Add this line
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe actuel</FormLabel>
                          <FormControl>
                            <PasswordInput
                              id="current"
                              type="password"
                              placeholder="Votre mot de passe actuel"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                clearErrors("credentials");
                                field.onChange(e); // Ensure the default field handler runs
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <PasswordInput
                              id="new"
                              type="password"
                              placeholder="Votre nouveau mot de passe"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                clearErrors("credentials");
                                field.onChange(e); // Ensure the default field handler runs
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit" // Ensure the button has type="submit"
                      disabled={
                        isPending ||
                        passwordForm.formState.isSubmitting ||
                        !passwordForm.formState.isDirty
                      }
                    >
                      {isPending ? "Enregistrement en cours..." : "Enregistrer"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              {/* <CardFooter>
                <div className="w-full flex space-y-4 flex-col items-center">
                  {errors.credentials?.message && (
                    <p className="text-center text-destructive">
                      {errors.credentials?.message}
                    </p>
                  )}
                  <Button
                    className="ml-3"
                    onClick={passwordForm.handleSubmit(onSubmitP)}
                    disabled={isPending || passwordForm.formState.isSubmitting}
                  >
                    {passwordForm.formState.isSubmitting
                      ? "Enregistrement en cours..."
                      : "Enregistrer"}
                  </Button>
                </div>
              </CardFooter> */}
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface AvatarInputProps {
  src: string | StaticImageData; // Ensure src is never null
  onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file"
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
      >
        <Image
          src={src}
          alt="Avatar preview"
          width={250}
          height={250}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          <Camera size={24} />
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
