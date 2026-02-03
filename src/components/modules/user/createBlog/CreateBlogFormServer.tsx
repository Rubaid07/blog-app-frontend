import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/env";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export default function CreateBlogFormServer() {
  const createBlog = async (formData: FormData) => {
    "use server";
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tags = formData.get("tags") as string;
    const blogData = {
      title,
      content,
      tags: tags
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
    };
    const cookieStore = await cookies();

    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(blogData),
    });
    if (res.ok) {
      revalidateTag("blogPosts", "max");
    }
  };
  return (
    <Card className="max-w-2xl mx-auto shadow-md border-t-4 mt-10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Create New Blog Post
        </CardTitle>
        <CardDescription>
          Fill out the form below to publish a new article to your blog.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="blog-form" action={createBlog} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Blog Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              name="title"
              placeholder="Enter an engaging title like 'The Future of AI'"
              required
              className="focus-visible:ring-offset-0 focus-visible:ring-1"
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <Label
              htmlFor="content"
              className="text-sm font-medium leading-none"
            >
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your blog post content here..."
              className="min-h-62.5 resize-y focus-visible:ring-offset-0 focus-visible:ring-1 font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              Markdown is supported.
            </p>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium leading-none">
              Tags
            </Label>
            <Input
              id="tags"
              type="text"
              name="tags"
              placeholder="e.g., tech, tutorial, nextjs (comma separated)"
            />
            <p className="text-xs text-muted-foreground">
              Add keywords to help categorize your post.
            </p>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end pt-4">
        <Button
          form="blog-form"
          type="submit"
          className="w-full sm:w-auto font-semibold"
        >
          Publish Blog Post
        </Button>
      </CardFooter>
    </Card>
  );
}
