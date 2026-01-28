import { Github, Linkedin, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: { [key: string]: React.ElementType } = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
};

export function Footer({ profile, isLoading }: { profile: any, isLoading: boolean }) {
  if (isLoading) {
    return (
      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
          </div>
          <div className="text-center md:text-right space-y-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </footer>
    );
  }
  
  return (
    <footer className="bg-secondary text-secondary-foreground py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          {profile?.contact?.social.map((social: any) => {
            const Icon = iconMap[social.name];
            if (!Icon) return null;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-secondary-foreground transition-transform hover:scale-110 hover:text-primary"
              >
                <Icon className="h-6 w-6" />
              </a>
            )
          })}
        </div>
        <div className="text-center md:text-right">
          <p className="text-sm">
            © {new Date().getFullYear()} {profile?.name}. All rights reserved.
          </p>
          <p className="text-sm">
            Designed & Built with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
