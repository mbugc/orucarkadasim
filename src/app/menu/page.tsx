"use client";

import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import { useDailyContent } from "@/hooks/use-daily-content";
import { AdBanner } from "@/components/ads/ad-banner";
import { AD_PLACEMENTS } from "@/lib/ad-config";
import { cn } from "@/lib/utils";

type MealType = "iftar" | "sahur";
type MenuChoice = "menu1" | "menu2";

export default function MenuPage() {
  const { menu, ramadanDay } = useDailyContent();
  const [mealType, setMealType] = useState<MealType>("iftar");
  const [menuChoice, setMenuChoice] = useState<MenuChoice>("menu1");

  if (!menu) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Menü verisi bulunamadı.</p>
      </div>
    );
  }

  const currentMeal = menu[mealType];
  const currentMenu = currentMeal[menuChoice];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UtensilsCrossed className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-lg font-bold">Günün Menüsü</h2>
          <p className="text-xs text-muted-foreground">{ramadanDay}. Gün</p>
        </div>
      </div>

      {/* Öğün seçimi */}
      <div className="flex gap-2 rounded-xl bg-muted p-1">
        {(["iftar", "sahur"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setMealType(type)}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors",
              mealType === type
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {type === "iftar" ? "İftar" : "Sahur"}
          </button>
        ))}
      </div>

      {/* Menü seçimi */}
      <div className="flex gap-2 rounded-xl bg-muted/50 p-1">
        {(["menu1", "menu2"] as const).map((choice) => (
          <button
            key={choice}
            onClick={() => setMenuChoice(choice)}
            className={cn(
              "flex-1 rounded-lg py-2 text-xs font-medium transition-colors",
              menuChoice === choice
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {choice === "menu1" ? "Menü 1" : "Menü 2"}
          </button>
        ))}
      </div>

      {/* Menü içeriği */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-primary">
          {currentMenu.name}
        </h3>
        <ul className="space-y-3">
          {currentMenu.items.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {index + 1}
              </span>
              <span className="text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <AdBanner slot={AD_PLACEMENTS.menuBelow} />
    </div>
  );
}
