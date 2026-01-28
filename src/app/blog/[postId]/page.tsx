"use client";

import { useMemo, useEffect } from "react";
import { doc, increment } from "firebase/firestore";
import { useFirestore, useDoc, updateDocumentNonBlocking } from "@/firebase";
import { portfolioOwnerId } from "@/lib/config";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

export default function BlogPostPage({ params }: { params: { postId: string } }) {
  const firestore = useFirestore();

  const postRef = useMemo(() => doc(firestore, 'users', portfolioOwnerId, 'blogPosts', params.postId), [firestore, params.postId]);
  const { data: post, isLoading: isPostLoading } = useDoc(postRef);

  const userRef = useMemo(() => doc(firestore, 'users', portfolioOwnerId), [firestore]);
  const { data: profileData, isLoading: isProfileLoading } = useDoc(userRef);
  
  // Increment view count logic
  useEffect(() => {
    if (postRef) {
      // Use sessionStorage to only increment the view count once per session
      const viewedKey = `viewed_post_${params.postId}`;
      if (!sessionStorage.getItem(viewedKey)) {
        updateDocumentNonBlocking(postRef, { viewCount: increment(1) });
        sessionStorage.setItem(viewedKey, 'true');
      }
    }
  }, [postRef, params.postId]);


  const isLoading = isPostLoading || isProfileLoading;

  // Function to calculate reading time
  const getReadingTime = (content: string) => {
    if (!content) return '0 min read';
    const wordsPerMinute = 200;
    const noOfWords = content.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    const readTime = Math.ceil(minutes);
    return `${readTime} min read`;
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header profile={null} skills={null} />
            <main className="flex-1">
                <article className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-4xl">
                    <Skeleton className="h-10 w-3/4 mb-4" />
                    <div className="flex items-center gap-4 mb-8 text-muted-foreground">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="aspect-video w-full rounded-lg mb-8" />
                    <div className="space-y-4 prose dark:prose-invert max-w-none">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                         <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </article>
            </main>
            <Footer profile={null} isLoading={true} />
        </div>
    );
  }

  if (!post) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header profile={profileData} skills={null} />
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Post not found</h1>
                    <p className="text-muted-foreground">The blog post you are looking for does not exist.</p>
                </div>
            </main>
            <Footer profile={profileData} isLoading={isProfileLoading} />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
        <Header profile={profileData} skills={null} />
        <main className="flex-1">
            <article className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-4xl">
                <header className="mb-8">
                    <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4" />
                           {post.publicationDate && <time dateTime={post.publicationDate}>{format(new Date(post.publicationDate), "MMMM d, yyyy")}</time>}
                        </div>
                        {post.content && (
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{getReadingTime(post.content)}</span>
                            </div>
                        )}
                    </div>
                     <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags?.map((tag: string) => (
                            <Badge key={tag} variant="secondary">
                            {tag}
                            </Badge>
                        ))}
                    </div>
                </header>

                {post.image && (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-8 shadow-lg">
                        <Image
                            src={post.image.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                            data-ai-hint={post.image.imageHint}
                            priority
                        />
                    </div>
                )}

                <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </main>
        <Footer profile={profileData} isLoading={isProfileLoading} />
    </div>
  );
}
