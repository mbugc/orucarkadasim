"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Clock, UtensilsCrossed, Compass, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/imsakiye", label: "İmsakiye", icon: CalendarDays },
  { href: "/namaz-vakitleri", label: "Namaz", icon: Clock },
  { href: "/menu", label: "Menü", icon: UtensilsCrossed },
  { href: "/kible", label: "Kıble", icon: Compass },
  { href: "/tesbih", label: "Tesbih", icon: CircleDot },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-px rounded-lg px-1.5 py-1.5 text-[10px] transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
