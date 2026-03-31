import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateSurveyResponse } from "@workspace/api-client-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  experience: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select your experience level",
  }),
  referral: z.enum(["friend", "social_media", "search", "other"], {
    required_error: "Please select how you heard about us",
  }),
  interests: z
    .array(z.enum(["frontend", "backend", "design", "devops"]))
    .min(1, "Please select at least one interest"),
});

type FormValues = z.infer<typeof formSchema>;

const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

const REFERRAL_OPTIONS = [
  { value: "friend", label: "A friend" },
  { value: "social_media", label: "Social media" },
  { value: "search", label: "Search engine" },
  { value: "other", label: "Other" },
] as const;

const INTEREST_OPTIONS = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "design", label: "Design" },
  { value: "devops", label: "DevOps" },
] as const;

export default function SurveyForm() {
  const [, setLocation] = useLocation();
  const createResponse = useCreateSurveyResponse();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      experience: undefined,
      referral: undefined,
      interests: [],
    },
  });

  function onSubmit(values: FormValues) {
    createResponse.mutate(
      { data: values },
      {
        onSuccess: (response) => {
          setLocation(`/results?id=${response.id}&name=${encodeURIComponent(response.name)}&experience=${response.experience}&referral=${response.referral}&interests=${response.interests.join(",")}`);
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Developer Survey</h1>
            <p className="text-sm text-muted-foreground">Tell us about yourself</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About You</CardTitle>
            <CardDescription>
              Fill in the details below. It only takes a minute.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Jane Smith"
                          data-testid="input-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Experience */}
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col gap-2"
                          data-testid="radio-experience"
                        >
                          {EXPERIENCE_OPTIONS.map((opt) => (
                            <div
                              key={opt.value}
                              className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 cursor-pointer hover:bg-accent transition-colors"
                            >
                              <RadioGroupItem
                                value={opt.value}
                                id={`experience-${opt.value}`}
                                data-testid={`radio-experience-${opt.value}`}
                              />
                              <label
                                htmlFor={`experience-${opt.value}`}
                                className="text-sm font-medium cursor-pointer flex-1"
                              >
                                {opt.label}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Referral */}
                <FormField
                  control={form.control}
                  name="referral"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How did you hear about us?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-referral">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {REFERRAL_OPTIONS.map((opt) => (
                            <SelectItem
                              key={opt.value}
                              value={opt.value}
                              data-testid={`select-referral-${opt.value}`}
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Interests */}
                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <div className="grid grid-cols-2 gap-2" data-testid="checkboxes-interests">
                        {INTEREST_OPTIONS.map((opt) => (
                          <FormField
                            key={opt.value}
                            control={form.control}
                            name="interests"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(opt.value)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value ?? [];
                                      field.onChange(
                                        checked
                                          ? [...current, opt.value]
                                          : current.filter((v) => v !== opt.value)
                                      );
                                    }}
                                    data-testid={`checkbox-interest-${opt.value}`}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-medium cursor-pointer">
                                  {opt.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createResponse.isPending}
                  data-testid="button-submit"
                >
                  {createResponse.isPending ? "Submitting…" : "Submit Survey"}
                </Button>

                {createResponse.isError && (
                  <p className="text-sm text-destructive text-center" data-testid="text-error">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
