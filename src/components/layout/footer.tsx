import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          {profile.contact.social.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="text-secondary-foreground transition-transform hover:scale-110 hover:text-primary"
            >
              <social.icon className="h-6 w-6" />
            </a>
          ))}
        </div>
        <div className="text-center md:text-right">
          <p className="text-sm">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="text-sm">
            Designed & Built with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
