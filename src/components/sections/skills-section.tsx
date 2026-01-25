import { Badge } from "@/components/ui/badge";
import { skills } from "@/lib/data";

export function SkillsSection() {
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
          {Object.entries(skills).map(([category, skillList]) => (
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
