import { blogService } from "@/services/blog.service";
import { BlogPost } from "@/types";
import { Calendar, Eye, MessageSquare, Tag, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  const { data } = await blogService.getBlogPosts();
  return data?.data?.map((blog: BlogPost) => ({ id: blog.id }));
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: blog } = await blogService.getBlogById(id);

  if (!blog) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center italic opacity-50">
        Post not found...
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 text-zinc-900 dark:text-zinc-100">
      {/* Navigation */}
      <div className="mb-12">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>
      </div>

      {/* Header Section */}
      <header className="space-y-6">
        <div className="flex flex-wrap gap-3">
          {blog.tags?.map((tag: string) => (
            <span
              key={tag}
              className="text-[11px] font-bold tracking-widest uppercase border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-none">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm opacity-60 border-b border-zinc-100 dark:border-zinc-900 pb-8">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{new Date(blog.createdAt).toLocaleDateString("en-GB")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{blog.views} views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            <span>{blog._count?.comments || 0} comments</span>
          </div>
        </div>
      </header>

      {/* Hero Media */}
      <div className="my-12">
        {blog.thumbnail ? (
          <Image
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-auto rounded-lg grayscale hover:grayscale-0 transition-all duration-500 border border-zinc-200 dark:border-zinc-800"
          />
        ) : (
          <div className="w-full aspect-21/9 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-col items-center justify-center opacity-30">
            <Tag className="w-8 h-8 mb-2" />
            <p className="text-xs uppercase tracking-widest font-bold">
              No Image Provided
            </p>
          </div>
        )}
      </div>

      {/* Content Area */}
      <main className="max-w-2xl mx-auto">
        <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none">
          <p className="leading-relaxed whitespace-pre-line text-lg md:text-xl">
            {blog.content}
          </p>
        </div>

        {/* Minimal Footer */}
        <footer className="mt-24 pt-10 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-mono font-bold">
                {blog.authorId.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">
                  Author Token
                </p>
                <p className="text-sm font-mono truncate max-w-37.5">
                  {blog.authorId}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="px-5 py-2 text-xs font-bold uppercase border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                Save Post
              </button>
              <button className="px-5 py-2 text-xs font-bold uppercase bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black">
                Share
              </button>
            </div>
          </div>
        </footer>
      </main>
    </article>
  );
}
