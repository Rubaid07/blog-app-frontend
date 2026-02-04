import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BlogPost } from "@/types";
import { Eye, MessageSquare, FileText, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HistoryTable({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="font-semibold py-4">Title</TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                Tags
              </div>
            </TableHead>
            <TableHead className="font-semibold text-right">
              <div className="flex items-center justify-end gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                Views
              </div>
            </TableHead>
            <TableHead className="font-semibold text-right">
              <div className="flex items-center justify-end gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                Comments
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                No posts found.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30 transition-colors group">
                <TableCell className="font-medium py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/5 rounded-md group-hover:bg-primary/10 transition-colors">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <span className="truncate max-w-62.5">{item.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(item.tags) ? (
                      item.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="font-normal text-[11px]">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="font-normal text-[11px]">
                        {item.tags}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right font-mono text-sm">
                  {item.views.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  <span className="bg-secondary/50 px-2.5 py-0.5 rounded-full text-secondary-foreground text-xs border">
                    {item._count?.comments ?? 0}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}