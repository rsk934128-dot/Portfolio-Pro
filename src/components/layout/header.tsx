"use client";

import { useEffect, useState, useCallback } from "react";
import { Bot, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PersonalizationTool } from "../personalization-tool";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Certifications", href: "#certifications" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "#contact" },
];

export function Header({ profile, skills }: { profile: any, skills: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAccountsChanged = useCallback((accounts: string[]) => {
      if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
      } else {
          setWalletAddress(null);
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected.",
          })
      }
  }, [toast]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    const getEthereum = () => {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
            return (window as any).ethereum;
        }
        return null;
    }
    
    const ethereum = getEthereum();

    const checkWalletConnection = async () => {
        const eth = getEthereum();
        if (eth) {
            try {
                const accounts: string[] = await eth.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                }
            } catch (error) {
                console.error("Error checking for wallet connection:", error);
            }
        }
    };
    checkWalletConnection();

    if (ethereum && ethereum.on) {
      ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    return () => {
        window.removeEventListener("scroll", handleScroll);
        if (ethereum && ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
    };

  }, [handleAccountsChanged]);

  const connectWallet = async () => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      try {
        const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);
        if (accounts.length > 0) {
            toast({
              title: "Wallet Connected",
              description: `Address: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
            });
        }
      } catch (error: any) {
        console.error("Wallet connection failed:", error);
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: error.message || "Could not connect to wallet.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "MetaMask Not Found",
        description: "Please install the MetaMask extension to connect your wallet.",
      });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-sm border-b"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <a href="/" className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg font-bold text-foreground">
            Portfolio Pro
          </span>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
            <PersonalizationTool profile={profile} skills={skills}>
                <Button>
                    <Sparkles className="mr-2" />
                    Personalize
                </Button>
            </PersonalizationTool>
            {walletAddress ? (
                 <Button variant="outline">
                    <Wallet className="mr-2" />
                    {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                </Button>
            ) : (
                <Button onClick={connectWallet}>
                    <Wallet className="mr-2" />
                    Connect Wallet
                </Button>
            )}
        </div>
      </div>
    </header>
  );
}
