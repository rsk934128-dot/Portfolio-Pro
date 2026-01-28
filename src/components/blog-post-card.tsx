import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export function BlogPostCard({ post }: { post: any }) {
  return (
    <Link href={`/blog/${post.id}`} className="group">
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {post.image && (
            <div className="aspect-video relative overflow-hidden">
            <Image
                src={post.image.imageUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={post.image.imageHint}
            />
            </div>
        )}
        <CardHeader>
            <CardTitle className="font-headline text-xl">
            {post.title}
            </CardTitle>
            {post.publicationDate && (
                <CardDescription>
                    {format(new Date(post.publicationDate), "MMMM d, yyyy")}
                </CardDescription>
            )}
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="text-muted-foreground line-clamp-3">{post.summary}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
                {post.tags?.slice(0, 2).map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                    {tag}
                    </Badge>
                ))}
            </div>
             <div className="flex items-center text-primary font-medium">
                Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
        </CardFooter>
        </Card>
    </Link>
  );
}
