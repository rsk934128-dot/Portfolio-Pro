import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Github, ExternalLink } from "lucide-react";

const ProjectCardSkeleton = () => (
    <Card className="flex flex-col overflow-hidden">
        <Skeleton className="aspect-video w-full" />
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <div className="flex flex-wrap gap-2 pt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
            </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
        </CardFooter>
    </Card>
);


export function ProjectsSection({ projects, isLoading }: { projects: any[] | null, isLoading: boolean }) {
  return (
    <section id="projects" className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            Projects & Case Studies
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Here are some of the projects I've worked on.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
          {!isLoading && projects?.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {project.image && (
                <div className="aspect-video relative overflow-hidden">
                    <Image
                        src={project.image.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                        data-ai-hint={project.image.imageHint}
                    />
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  {project.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{project.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {project.repoUrl && project.repoUrl !== '#' && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {project.liveUrl && project.liveUrl !== '#' && (
                  <Button size="sm" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
