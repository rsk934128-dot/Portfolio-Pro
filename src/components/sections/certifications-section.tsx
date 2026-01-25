import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Award } from "lucide-react";
import { certifications } from "@/lib/data";

export function CertificationsSection() {
  return (
    <section id="certifications" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            Certifications & Learning
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            My commitment to continuous growth and learning.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert) => (
            <Card key={cert.title} className="flex flex-col text-center items-center p-6 transition-all duration-300 hover:shadow-xl hover:bg-card/90">
                <Award className="h-12 w-12 text-accent mb-4" />
                <CardHeader className="p-0">
                    <CardTitle className="font-headline text-lg">{cert.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow p-4">
                    <CardDescription>
                    Issued by {cert.issuer} &middot; {cert.date}
                    </CardDescription>
                </CardContent>
                {cert.url !== '#' && (
                    <Button variant="link" asChild>
                        <a href={cert.url} target="_blank" rel="noopener noreferrer">
                        Validate Certificate <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
