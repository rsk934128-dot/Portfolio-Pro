import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const SkillsCategorySkeleton = () => (
    <div>
        <Skeleton className="h-8 w-1/2 mx-auto mb-6" />
        <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
        </div>
    </div>
);

export function SkillsSection({ skills, isLoading }: { skills: any[] | null, isLoading: boolean }) {
  const skillsByCategory = useMemo(() => {
    if (!skills) return {};
    return skills.reduce((acc: { [key: string]: string[] }, skill: any) => {
      const { category, name } = skill;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(name);
      return acc;
    }, {});
  }, [skills]);

  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            Technical Skills
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            A selection of my technical abilities and tools I use.
          </p>
        </div>
        <div className="space-y-10">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <SkillsCategorySkeleton key={i} />)}
          {!isLoading && Object.entries(skillsByCategory).map(([category, skillList]) => (
            <div key={category}>
              <h3 className="font-headline text-2xl font-semibold mb-6 text-center text-primary">
                {category}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {skillList.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-base md:text-lg px-4 py-2 rounded-full cursor-default transition-transform hover:scale-105 bg-secondary/80 hover:bg-secondary"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
