import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Wrench, BookMarked, Shield, Clapperboard, Scale, Sparkles, Heart, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type CanonMode = {
  verbosity: string;
  mythic_allowed: boolean;
  description: string;
};

type Canon = {
  version: string;
  modes: Record<string, CanonMode>;
};

const modeIcons: Record<string, any> = {
  Engineer: Wrench,
  Archivist: BookMarked,
  Guardian: Shield,
  Showrunner: Clapperboard,
  Civic: Scale,
  Ritualist: Sparkles,
  Companion: Heart,
};

const modeColors: Record<string, string> = {
  Engineer: "text-blue-600 dark:text-blue-400",
  Archivist: "text-amber-600 dark:text-amber-400",
  Guardian: "text-red-600 dark:text-red-400",
  Showrunner: "text-purple-600 dark:text-purple-400",
  Civic: "text-slate-600 dark:text-slate-400",
  Ritualist: "text-emerald-600 dark:text-emerald-400",
  Companion: "text-pink-600 dark:text-pink-400",
};

export default function SetAICouncils() {
  const [selectedMode, setSelectedMode] = useState<string>("Companion");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: canon } = useQuery<Canon>({
    queryKey: ["/api/canon"],
    queryFn: async () => {
      const res = await fetch("/api/canon");
      if (!res.ok) throw new Error("Failed to fetch canon");
      return res.json();
    },
  });

  const { data: currentPref } = useQuery({
    queryKey: ["/api/councils/mode/anonymous"],
    queryFn: async () => {
      const res = await fetch("/api/councils/mode/anonymous");
      if (!res.ok) throw new Error("Failed to fetch mode preference");
      return res.json();
    },
  });

  const setModeMutation = useMutation({
    mutationFn: async (mode: string) => {
      const res = await fetch("/api/councils/mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "anonymous", defaultPersona: mode, verbosity: "medium", consent: true }),
      });
      if (!res.ok) throw new Error("Failed to set mode");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/councils/mode/anonymous"] });
      toast({ title: "Mode updated", description: `Switched to ${selectedMode} mode.` });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };

  const handleApplyMode = () => {
    setModeMutation.mutate(selectedMode);
  };

  const modes = canon?.modes ? Object.entries(canon.modes) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Users className="h-10 w-10 text-purple-600" />
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-midnight dark:text-parchment">
            Councils
          </h1>
          <p className="text-iron dark:text-parchment/70 font-merriweather">
            Mode switching and persona selection
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Card className="border-iron/20 dark:border-parchment/20">
          <CardHeader>
            <CardTitle className="font-cinzel text-midnight dark:text-parchment">
              Current Mode
            </CardTitle>
            <CardDescription className="font-merriweather">
              Your active persona determines how SetAI responds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {currentPref && (
                <>
                  {(() => {
                    const Icon = modeIcons[currentPref.defaultPersona] || Heart;
                    return <Icon className={`h-8 w-8 ${modeColors[currentPref.defaultPersona] || "text-pink-600"}`} />;
                  })()}
                  <div>
                    <p className="font-cinzel text-xl text-midnight dark:text-parchment">
                      {currentPref.defaultPersona}
                    </p>
                    <p className="font-merriweather text-sm text-iron dark:text-parchment/70">
                      Verbosity: {currentPref.verbosity}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-iron/20 dark:border-parchment/20">
        <CardHeader>
          <CardTitle className="font-cinzel text-midnight dark:text-parchment">
            Available Personas
          </CardTitle>
          <CardDescription className="font-merriweather">
            Each persona shapes how SetAI interprets and responds to your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMode} onValueChange={handleModeChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modes.map(([name, mode]) => {
              const Icon = modeIcons[name] || Users;
              const isSelected = selectedMode === name;
              const isCurrent = currentPref?.defaultPersona === name;

              return (
                <div key={name} className="relative" data-testid={`mode-${name.toLowerCase()}`}>
                  <RadioGroupItem value={name} id={name} className="peer sr-only" />
                  <Label
                    htmlFor={name}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/20"
                        : "border-iron/20 dark:border-parchment/20 hover:border-iron/40 dark:hover:border-parchment/40"
                    }`}
                  >
                    <Icon className={`h-8 w-8 mt-1 ${modeColors[name] || "text-gray-600"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel text-lg text-midnight dark:text-parchment">
                          {name}
                        </span>
                        {isCurrent && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="font-merriweather text-sm text-iron dark:text-parchment/70 mt-1">
                        {mode.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          Verbosity: {mode.verbosity}
                        </Badge>
                        {mode.mythic_allowed && (
                          <Badge variant="outline" className="text-xs text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                            Mythic allowed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleApplyMode}
              disabled={setModeMutation.isPending || selectedMode === currentPref?.defaultPersona}
              className="font-cinzel"
              data-testid="button-apply-mode"
            >
              {setModeMutation.isPending ? "Applying..." : "Apply Mode"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
