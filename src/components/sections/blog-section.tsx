import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogPostCard } from "../blog-post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

const BlogPostCardSkeleton = () => (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
        <Skeleton className="aspect-video w-full" />
        <div className="p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-1/3" />
        </div>
    </div>
);

export function BlogSection({ blogPosts, isLoading }: { blogPosts: any[] | null, isLoading: boolean }) {
  const latestPosts = blogPosts?.slice(0, 3); // Show latest 3 posts

  return (
    <section id="blog" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            From the Blog
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            My latest articles on web development, AI, and technology.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <BlogPostCardSkeleton key={i} />)}
          {!isLoading && latestPosts?.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
        {blogPosts && blogPosts.length > 0 && (
            <div className="text-center mt-12">
                <Button asChild>
                    <Link href="/blog">
                        View All Posts <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        )}
      </div>
    </section>
  );
}
