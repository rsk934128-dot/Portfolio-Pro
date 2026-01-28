import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote } from "lucide-react";

const TestimonialCardSkeleton = () => (
    <Card className="flex flex-col justify-center items-center text-center p-6 min-h-[250px]">
        <CardHeader>
            <Skeleton className="h-8 w-8 rounded-full mb-4" />
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-32" />
        </CardFooter>
    </Card>
);

export function TestimonialsSection({ testimonials, isLoading }: { testimonials: any[] | null, isLoading: boolean }) {
  if (isLoading) {
      return (
        <section id="testimonials" className="py-16 md:py-24 bg-secondary/50">
             <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">
                    What Others Say
                </h2>
                <p className="text-muted-foreground mt-2 text-lg">
                    Testimonials from colleagues and clients.
                </p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {Array.from({ length: 3 }).map((_, i) => <TestimonialCardSkeleton key={i} />)}
                 </div>
            </div>
        </section>
      )
  }

  if (!testimonials || testimonials.length === 0) {
    return null; // Don't render the section if there are no testimonials
  }
  
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            What Others Say
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Testimonials from colleagues and clients I've worked with.
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                 <div className="p-1 h-full">
                    <Card className="flex flex-col justify-between text-center items-center p-6 h-full shadow-lg">
                        <CardHeader className="pb-4">
                            <Quote className="h-8 w-8 text-accent" />
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="italic text-foreground/80">"{testimonial.text}"</p>
                        </CardContent>
                        <CardFooter className="flex flex-col items-center pt-4">
                            <p className="font-bold text-lg">{testimonial.author}</p>
                            <p className="text-muted-foreground text-sm">{testimonial.authorTitle}{testimonial.authorCompany && `, ${testimonial.authorCompany}`}</p>
                        </CardFooter>
                    </Card>
                 </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
