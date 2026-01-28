'use client';

import { useState, useMemo, useTransition, useRef, useEffect } from 'react';
import { Bot, MessageSquare, Send, User, X } from 'lucide-react';
import { doc, collection } from 'firebase/firestore';

import { useFirestore, useDoc, useCollection } from '@/firebase';
import { portfolioOwnerId } from '@/lib/config';
import { getChatbotResponse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isResponding, startTransition] = useTransition();
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // 1. Fetch all portfolio data needed for context
    const firestore = useFirestore();

    const { data: profileData, isLoading: isProfileLoading } = useDoc(useMemo(() => doc(firestore, 'users', portfolioOwnerId), [firestore]));
    const { data: projectsData, isLoading: areProjectsLoading } = useCollection(useMemo(() => collection(firestore, 'users', portfolioOwnerId, 'projects'), [firestore]));
    const { data: skillsData, isLoading: areSkillsLoading } = useCollection(useMemo(() => collection(firestore, 'users', portfolioOwnerId, 'skills'), [firestore]));
    const { data: certsData, isLoading: areCertsLoading } = useCollection(useMemo(() => collection(firestore, 'users', portfolioOwnerId, 'certifications'), [firestore]));
    const { data: testimonialsData, isLoading: areTestimonialsLoading } = useCollection(useMemo(() => collection(firestore, 'testimonials'), [firestore]));
    const { data: blogPostsData, isLoading: areBlogPostsLoading } = useCollection(useMemo(() => collection(firestore, 'users', portfolioOwnerId, 'blogPosts'), [firestore]));

    const isDataLoading = isProfileLoading || areProjectsLoading || areSkillsLoading || areCertsLoading || areTestimonialsLoading || areBlogPostsLoading;

    // 2. Create the portfolio context string once data is loaded
    const portfolioContext = useMemo(() => {
        if (isDataLoading) return null;
        return JSON.stringify({
            profile: profileData,
            skills: skillsData,
            projects: projectsData,
            certifications: certsData,
            testimonials: testimonialsData,
            blogPosts: blogPostsData?.map(p => ({ title: p.title, summary: p.summary, tags: p.tags })), // Summarize blog posts for context
        });
    }, [isDataLoading, profileData, skillsData, projectsData, certsData, testimonialsData, blogPostsData]);
    
    // Auto-scroll to bottom
    useEffect(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isResponding || !portfolioContext) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');

        startTransition(async () => {
            try {
                const response = await getChatbotResponse({
                    messages: newMessages,
                    portfolioContext,
                });
                setMessages(prev => [...prev, { role: 'model', content: response }]);
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Chatbot Error',
                    description: 'Failed to get a response. Please try again later.',
                });
                // remove the user message if the call fails
                setMessages(prev => prev.slice(0, -1));
            }
        });
    };
    
    const toggleChat = () => {
        setIsOpen(!isOpen);
        if(!isOpen && messages.length === 0){
             setTimeout(() => {
                setMessages([{ role: 'model', content: `Hi there! I'm Portfolio Pro, Muskan's AI assistant. Feel free to ask me anything about her skills, projects, or experience.` }]);
            }, 300);
        }
    }

    return (
        <>
            <div className={cn("fixed bottom-4 right-4 z-50 transition-all duration-300", isOpen ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100")}>
                <Button onClick={toggleChat} size="lg" className="rounded-full w-16 h-16 shadow-lg">
                    <MessageSquare className="h-8 w-8" />
                </Button>
            </div>
            <div className={cn(
                "fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-md h-[70vh] max-h-[600px] rounded-lg shadow-2xl bg-card border flex flex-col transition-all duration-300 origin-bottom-right",
                isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
            )}>
                 <header className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>PP</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">Portfolio Pro</h3>
                            <p className="text-xs text-muted-foreground">AI Assistant</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleChat}>
                        <X className="h-5 w-5" />
                    </Button>
                </header>
                <ScrollArea className="flex-1" ref={scrollAreaRef}>
                    <div className="p-4 space-y-6">
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? "justify-end" : "")}>
                                {message.role === 'model' && <Avatar className='w-8 h-8'><AvatarFallback>AI</AvatarFallback></Avatar>}
                                <div className={cn(
                                    "rounded-lg px-4 py-2 max-w-[80%] text-sm",
                                    message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-secondary"
                                )}>
                                    <p className='whitespace-pre-wrap'>{message.content}</p>
                                </div>
                                 {message.role === 'user' && <Avatar className='w-8 h-8'><AvatarFallback><User /></AvatarFallback></Avatar>}
                            </div>
                        ))}
                         {isResponding && (
                             <div className="flex items-start gap-3">
                                 <Avatar className='w-8 h-8'><AvatarFallback>AI</AvatarFallback></Avatar>
                                <div className="rounded-lg px-4 py-2 max-w-[80%] text-sm bg-secondary">
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <footer className="p-4 border-t">
                     <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isDataLoading ? "Training AI..." : "Ask about projects, skills..."}
                            disabled={isResponding || isDataLoading}
                            autoComplete='off'
                        />
                        <Button type="submit" size="icon" disabled={isResponding || isDataLoading || !input.trim()}>
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </footer>
            </div>
        </>
    );
}
