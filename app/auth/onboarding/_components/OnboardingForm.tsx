"use client";

import { getColleges } from "@/app/(protected)/dashboard/college/_actions/collage.actions";
import { getDepartmentsByCollegeId } from "@/app/(protected)/dashboard/college/_actions/department.actions";
import { getFieldsDepartmentId } from "@/app/(protected)/dashboard/college/_actions/field.actions";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import SubmitButton from "@/components/shared/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DBExtendedUser } from "@/lib/types/db";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import {
  OnboardingSchema,
  OnboardingSchemaType,
} from "@/lib/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { onboarding } from "../_actions/onboarding.actions";

interface Props {
  user: DBExtendedUser;
}

const OnboardingForm = ({ user }: Props) => {
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");

  const { update } = useSession();

  const [files, setFiles] = useState<File[]>([]);
  const { data: colleges } = useQuery({
    queryKey: ["colleges"],
    queryFn: async () => await getColleges(),
  });
  const { data: departments } = useQuery({
    queryKey: ["departments", selectedCollege],
    queryFn: async () => await getDepartmentsByCollegeId(selectedCollege),
    enabled: !!selectedCollege,
  });
  const { data: fields } = useQuery({
    queryKey: ["fields", selectedDepartment],
    queryFn: async () => await getFieldsDepartmentId(selectedDepartment),
    enabled: !!selectedDepartment,
  });

  const queryClient = useQueryClient();

  const { mutate: onboardingUser, isPending } = useMutation({
    mutationFn: async (values: OnboardingSchemaType) => {
      const blob = values.image as string;
      const hasImageChanged = isBase64Image(blob);
      if (hasImageChanged) {
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0].url) {
          values.image = imgRes[0].url;
        }
      }
      console.log(values);
      return await onboarding(values);
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        update();
        toast.success(data.success);
        router.push("/dashboard");
      }

      // After creating a transaction, we need to invalidate the overview query which will fetch data in the home page
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (e) => {
      toast.loading(`Error: ${e.message}`);
    },
  });

  // 1. Define your form.
  const form = useForm<OnboardingSchemaType>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      collegeId: user?.College || undefined,
      departmentId: user?.Department?.name || undefined,
      fieldId: user?.Field?.name || undefined,
      onboarded: true,
      image: user?.image || undefined,
      bio: user?.bio || undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: OnboardingSchemaType) {
    onboardingUser(values);
  }
  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };
  const handleCollegeChange = (value: string) => {
    setSelectedCollege(value);
    form.setValue("collegeId", value);
  };
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    form.setValue("departmentId", value);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="min-w-lg mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              ⚙️ Onboarding
            </CardTitle>
            <CardDescription>
              Fill the missing information that is used to identify you on Smart
              research assistant app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="flex items-center justify-center gap-4">
                  <FormLabel>
                    {field.value ? (
                      <Image
                        src={field.value}
                        alt="profile_icon"
                        width={96}
                        height={96}
                        priority
                        className="h-28 w-28 rounded-full object-contain"
                      />
                    ) : (
                      <ImageIcon />
                    )}
                  </FormLabel>
                  <FormControl className="text-base-semibold flex-1 text-gray-200">
                    <Input
                      type="file"
                      accept="image/*"
                      placeholder="Edit profile image"
                      className=""
                      onChange={(e) => handleImage(e, field.onChange)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              placeholder="Enter Full Name"
              label="Full Name"
              disabled
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              placeholder="Enter email address"
              label="Email address"
              disabled
            />
            <FormField
              control={form.control}
              name="collegeId"
              render={({ field }) => (
                <FormItem className="w-full flex-1">
                  <FormLabel>College</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={handleCollegeChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your college" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Colleges</SelectLabel>
                          {colleges?.map((college, i) => (
                            <SelectItem
                              key={college.name + i}
                              value={college.id}
                            >
                              <p>{college.name}</p>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem className="w-full flex-1">
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={handleDepartmentChange}
                      defaultValue={field.value}
                      disabled={!selectedCollege}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Department</SelectLabel>
                          {departments?.map((department, i) => (
                            <SelectItem
                              key={department.name + i}
                              value={department.id}
                            >
                              <p>{department.name}</p>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fieldId"
              render={({ field }) => (
                <FormItem className="w-full flex-1">
                  <FormLabel>Program</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedDepartment}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Program</SelectLabel>
                          {fields?.map((program, i) => (
                            <SelectItem
                              key={program.name + i}
                              value={program.id}
                            >
                              <p>{program.name}</p>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      className="account-form_input no-focus"
                      {...field}
                      placeholder="Tell us a little about yourself"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <SubmitButton isLoading={isPending}>Save</SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default OnboardingForm;
