"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { addAnnouncement } from "@/lib/validators";
import { createAnnouncement } from "@/lib/actions/announcements.actions";
import AnnouncementImageUploader from "./AnnouncementImageUploader";

export default function Add() {
  const [open, setOpen] = useState(false);
  const [mediaId, setMediaId] = useState(""); // Store uploaded mediaId

  const form = useForm<z.infer<typeof addAnnouncement>>({
    resolver: zodResolver(addAnnouncement),
    defaultValues: {
      titre: "",
      mediaId: "",
    },
  });

  // Open Form Handler
  const handleOpenForm = () => {
    setOpen(true);
  };

  const handleOpenChange = () => {
    setOpen((prev) => !prev);
    form.reset();
    setMediaId("");
  };

  // Submit Form Handler
  const onSubmit: SubmitHandler<z.infer<typeof addAnnouncement>> = async (
    values
  ) => {
    try {
      const res = await createAnnouncement({ ...values }); // Include mediaId
      if (res.success) {
        toast.success(res.message);
        form.reset();
        setMediaId("");
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Quelque chose s'est mal passé. Veuillez réessayer.");

      console.error(error);
    }
  };

  // Inside the component
  useEffect(() => {
    form.setValue("mediaId", mediaId); // Sync mediaId with form state
  }, [mediaId, form]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div className="flex items-center gap-2">
        <h1 className="font-poppins text-xl">Ajouter une annonce</h1>
        <Button onClick={handleOpenForm} className="max-w-[40px]">
          <Plus />
        </Button>
      </div>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Ajouter une annonce/avis</DialogTitle>
              <DialogDescription>Informe tes camarades !!</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="titre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre (min 3 caractères)</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez un titre" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Upload Image</FormLabel>
                <FormControl>
                  <div>
                    <AnnouncementImageUploader setMediaId={setMediaId} />
                  </div>
                </FormControl>
              </FormItem>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={
                  form.watch("titre").length < 3 ||
                  !mediaId ||
                  form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
