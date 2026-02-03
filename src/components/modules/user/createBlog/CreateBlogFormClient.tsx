"use client";

import { createBlogPost } from "@/actions/blog.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, PenLine, Tag, TextQuote } from "lucide-react";

const blogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must be less than 5000 characters"),
  tags: z.string(),
});

export function CreateBlogFormClient() {
  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
    validators: {
      onSubmit: blogSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Publishing your story...");

      const blogData = {
        title: value.title,
        content: value.content,
        tags: value.tags
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      };

      try {
        const res = await createBlogPost(blogData);

        if (res?.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }

        toast.success("Post published successfully!", { id: toastId });
        form.reset(); // Clear form on success
      } catch (err) {
        toast.error("Something went wrong. Please try again.", { id: toastId });
      }
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-muted/60">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <PenLine className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create New Post</CardTitle>
        </div>
        <CardDescription>
          Share your thoughts with the world. Draft your content and add relevant tags.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form
          id="blog-post"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <FieldGroup className="space-y-4">
            {/* Title Field */}
            <form.Field
              name="title"
              children={(field) => (
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    Post Title
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="e.g. Mastering Next.js Server Actions"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={field.state.meta.errors.length ? "border-destructive" : ""}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            {/* Content Field */}
            <form.Field
              name="content"
              children={(field) => (
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    Content
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder="Write your story here..."
                    className="min-h-[200px] resize-y"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            {/* Tags Field */}
            <form.Field
              name="tags"
              children={(field) => (
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5" />
                    Tags
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="tech, tutorial, react"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <p className="text-[0.7rem] text-muted-foreground mt-1">
                    Separate tags with commas
                  </p>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="pt-2">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button 
              form="blog-post" 
              type="submit" 
              className="w-full transition-all"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Post"
              )}
            </Button>
          )}
        />
      </CardFooter>
    </Card>
  );
}