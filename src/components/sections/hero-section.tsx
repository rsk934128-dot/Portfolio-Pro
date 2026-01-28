import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSection({ profile, isLoading }: { profile: any, isLoading: boolean }) {
    if (isLoading) {
        return (
          <section id="home" className="py-16 md:py-24 lg:py-32 bg-secondary/50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1 flex justify-center">
                  <Skeleton className="h-64 w-64 md:h-80 md:w-80 rounded-full" />
                </div>
                <div className="md:col-span-2 text-center md:text-left space-y-4">
                  <Skeleton className="h-14 w-3/4 mx-auto md:mx-0" />
                  <Skeleton className="h-8 w-1/2 mx-auto md:mx-0" />
                  <Skeleton className="h-20 w-full max-w-2xl mx-auto md:mx-0" />
                  <div className="flex justify-center md:justify-start gap-4 pt-4">
                    <Skeleton className="h-11 w-32" />
                    <Skeleton className="h-11 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
    }
  
    if (!profile) {
        return null;
    }

  return (
    <section id="home" className="py-16 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex justify-center">
            {profile.profilePicture && (
                <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-full overflow-hidden shadow-2xl border-4 border-primary">
                    <Image
                        src={profile.profilePicture.imageUrl}
                        alt={profile.name}
                        fill
                        className="object-cover"
                        data-ai-hint={profile.profilePicture.imageHint}
                        priority
                    />
                </div>
            )}
          </div>
          <div className="md:col-span-2 text-center md:text-left space-y-4">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight">
              {profile.name}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              {profile.title}
            </p>
            <p className="text-base md:text-lg max-w-2xl mx-auto md:mx-0 text-foreground/80">
              {profile.bio}
            </p>
            <div className="flex justify-center md:justify-start gap-4 pt-4">
              <Button asChild size="lg">
                <a href="#projects">View My Work</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#contact">Get in Touch</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
