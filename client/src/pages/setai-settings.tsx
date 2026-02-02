import { useQuery } from "@tanstack/react-query";
import { Settings, Shield, Feather, BookOpen, Eye, AlertTriangle, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SetAISettings() {
  const { data: canon } = useQuery({
    queryKey: ["/api/canon"],
    queryFn: async () => {
      const res = await fetch("/api/canon");
      if (!res.ok) throw new Error("Failed to fetch canon");
      return res.json();
    },
  });

  const { data: founderCanon } = useQuery({
    queryKey: ["/api/founder_canon"],
    queryFn: async () => {
      const res = await fetch("/api/founder_canon");
      if (!res.ok) throw new Error("Failed to fetch founder canon");
      return res.json();
    },
  });

  const { data: pipeline } = useQuery({
    queryKey: ["/api/security_pipeline"],
    queryFn: async () => {
      const res = await fetch("/api/security_pipeline");
      if (!res.ok) throw new Error("Failed to fetch pipeline");
      return res.json();
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-10 w-10 text-slate-600" />
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-midnight dark:text-parchment">
            Settings
          </h1>
          <p className="text-iron dark:text-parchment/70 font-merriweather">
            Preferences and canon viewer
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-iron/20 dark:border-parchment/20">
          <CardHeader>
            <CardTitle className="font-cinzel text-midnight dark:text-parchment flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              System Canon
            </CardTitle>
            <CardDescription className="font-merriweather">
              Core principles and mode configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canon ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="version">
                  <AccordionTrigger className="font-cinzel">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Version Info
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Badge className="font-mono">{canon.version}</Badge>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="immutables">
                  <AccordionTrigger className="font-cinzel">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Immutables ({canon.immutables?.length || 0})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {canon.immutables?.map((item: string) => (
                        <li key={item} className="flex items-center gap-2 font-merriweather text-sm">
                          <Shield className="h-3 w-3 text-amber-600" />
                          {item.replace(/_/g, " ")}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="truth_layers">
                  <AccordionTrigger className="font-cinzel">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Truth Layers
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex gap-2 flex-wrap">
                      {canon.truth_layers?.map((layer: string) => (
                        <Badge key={layer} variant="outline" className="capitalize">
                          {layer}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="modes">
                  <AccordionTrigger className="font-cinzel">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Mode Configurations
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {canon.modes && Object.entries(canon.modes).map(([name, config]: [string, any]) => (
                        <div key={name} className="border-l-2 border-amber-200 dark:border-amber-800 pl-4">
                          <p className="font-cinzel font-semibold text-midnight dark:text-parchment">{name}</p>
                          <p className="font-merriweather text-sm text-iron dark:text-parchment/70 mb-2">
                            {config.description}
                          </p>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              Verbosity: {config.verbosity}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${config.mythic_allowed ? "text-purple-600" : "text-gray-600"}`}>
                              Mythic: {config.mythic_allowed ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <p className="text-iron/60 dark:text-parchment/60 font-merriweather">Loading canon...</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-iron/20 dark:border-parchment/20">
          <CardHeader>
            <CardTitle className="font-cinzel text-midnight dark:text-parchment flex items-center gap-2">
              <Feather className="h-5 w-5 text-emerald-600" />
              Founder Canon
            </CardTitle>
            <CardDescription className="font-merriweather">
              Founder-defined rules and principles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {founderCanon?.founder ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="founder">
                  <AccordionTrigger className="font-cinzel">
                    <div className="flex items-center gap-2">
                      <Feather className="h-4 w-4" />
                      Founder: {founderCanon.founder.name}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-merriweather text-sm text-iron dark:text-parchment/80">
                      The founding principles established by {founderCanon.founder.name}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="non_negotiables">
                  <AccordionTrigger className="font-cinzel">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      Non-Negotiables ({founderCanon.founder.non_negotiables?.length || 0})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {founderCanon.founder.non_negotiables?.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 font-merriweather text-sm">
                          <span className="text-red-600 font-bold mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="spiritual">
                  <AccordionTrigger className="font-cinzel">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-purple-600" />
                      Spiritual Context
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={founderCanon.founder.spiritual_context?.mythic_allowed ? "text-purple-600" : ""}>
                          Mythic: {founderCanon.founder.spiritual_context?.mythic_allowed ? "Allowed" : "Restricted"}
                        </Badge>
                      </div>
                      {founderCanon.founder.spiritual_context?.rules && (
                        <ul className="space-y-2">
                          {founderCanon.founder.spiritual_context.rules.map((rule: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 font-merriweather text-sm">
                              <span className="text-purple-600 font-bold mt-0.5">•</span>
                              {rule}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sovereignty">
                  <AccordionTrigger className="font-cinzel">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-600" />
                      Sovereignty Principles
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {founderCanon.founder.sovereignty_principles?.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 font-merriweather text-sm">
                          <span className="text-amber-600 font-bold mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <p className="text-iron/60 dark:text-parchment/60 font-merriweather">Loading founder canon...</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-iron/20 dark:border-parchment/20">
        <CardHeader>
          <CardTitle className="font-cinzel text-midnight dark:text-parchment flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Security Pipeline Configuration
          </CardTitle>
          <CardDescription className="font-merriweather">
            Pipeline version and rules overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pipeline ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge className="font-mono">v{pipeline.version}</Badge>
                <span className="font-merriweather text-sm text-iron dark:text-parchment/70">
                  {pipeline.stages?.length || 0} stages configured
                </span>
              </div>
              <Separator />
              <div>
                <p className="font-cinzel font-semibold text-midnight dark:text-parchment mb-2">Pipeline Rules</p>
                <ul className="space-y-2">
                  {pipeline.rules?.map((rule: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 font-merriweather text-sm text-iron dark:text-parchment/80">
                      <span className="text-amber-600 font-bold">{index + 1}.</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-iron/60 dark:text-parchment/60 font-merriweather">Loading pipeline configuration...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
