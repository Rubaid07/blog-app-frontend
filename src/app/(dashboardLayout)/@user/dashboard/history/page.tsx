import { blogService } from "@/services/blog.service";

export default async function HistoryPage() {
    const response = await blogService.getBlogPosts();
    const posts = response.data?.data || [];
    console.log(posts);
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                Blog Post History
            </h1>
        </div>
    )
};
