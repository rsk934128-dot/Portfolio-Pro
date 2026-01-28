"use client";

import { doc, collection } from "firebase/firestore";
import { useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { portfolioOwnerId } from "@/lib/config";
import { BlogPostCard } from "@/components/blog-post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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

export default function BlogPage() {
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => doc(firestore, 'users', portfolioOwnerId), [firestore]);
  const { data: profileData, isLoading: isProfileLoading } = useDoc(userRef);

  const blogPostsRef = useMemoFirebase(() => collection(firestore, 'users', portfolioOwnerId, 'blogPosts'), [firestore]);
  const { data: blogPosts, isLoading: arePostsLoading } = useCollection(blogPostsRef);

  const isLoading = isProfileLoading || arePostsLoading;

  return (
    <div className="flex flex-col min-h-screen">
        <Header profile={profileData} skills={null} />
        <main className="flex-1">
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h1 className="font-headline text-4xl md:text-5xl font-bold">Blog</h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            My thoughts and articles on technology, development, and more.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading && Array.from({ length: 6 }).map((_, i) => <BlogPostCardSkeleton key={i} />)}
                        {!isLoading && blogPosts?.map((post) => (
                            <BlogPostCard key={post.id} post={post} />
                        ))}
                    </div>
                    {!isLoading && blogPosts?.length === 0 && (
                        <p className="text-center text-muted-foreground mt-12">No blog posts yet. Check back soon!</p>
                    )}
                </div>
            </section>
        </main>
      <Footer profile={profileData} isLoading={isProfileLoading} />
    </div>
  );
}
