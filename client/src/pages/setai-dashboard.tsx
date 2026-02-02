import { Link } from "wouter";
import { Shield, BookOpen, Clock, Users, AlertTriangle, Settings, Feather, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function SetAIDashboard() {
  const { data: canon } = useQuery({
    queryKey: ["/api/canon"],
    queryFn: async () => {
      const res = await fetch("/api/canon");
      if (!res.ok) throw new Error("Failed to fetch canon");
      return res.json();
    },
  });

  const { data: securityEvents } = useQuery({
    queryKey: ["/api/security/events"],
    queryFn: async () => {
      const res = await fetch("/api/security/events?limit=5");
      if (!res.ok) throw new Error("Failed to fetch security events");
      return res.json();
    },
  });

  const dashboardItems = [
    {
      title: "Codex",
      description: "Events, documents, and projects archive",
      icon: BookOpen,
      href: "/setai/codex",
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Timeline",
      description: "Chronological event visualization",
      icon: Clock,
      href: "/setai/timeline",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Councils",
      description: "Mode switching and persona selection",
      icon: Users,
      href: "/setai/councils",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Security",
      description: "Pipeline status and event monitoring",
      icon: AlertTriangle,
      href: "/setai/security",
      color: "text-red-600 dark:text-red-400",
    },
    {
      title: "Settings",
      description: "Preferences and canon viewer",
      icon: Settings,
      href: "/setai/settings",
      color: "text-slate-600 dark:text-slate-400",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-10 w-10 text-amber-600" />
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-midnight dark:text-parchment">
            SetAI Dashboard
          </h1>
          <p className="text-iron dark:text-parchment/70 font-merriweather">
            Sovereignty-first intelligence layer
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-iron/20 dark:border-parchment/20 h-full" data-testid={`card-${item.title.toLowerCase()}`}>
              <CardHeader className="flex flex-row items-center gap-4">
                <item.icon className={`h-8 w-8 ${item.color}`} />
                <div>
                  <CardTitle className="font-cinzel text-midnight dark:text-parchment">{item.title}</CardTitle>
                  <CardDescription className="font-merriweather">{item.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-iron/20 dark:border-parchment/20">
          <CardHeader>
            <CardTitle className="font-cinzel text-midnight dark:text-parchment flex items-center gap-2">
              <Feather className="h-5 w-5 text-amber-600" />
              Canon Immutables
            </CardTitle>
            <CardDescription className="font-merriweather">
              Core principles that cannot be overridden
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canon?.immutables ? (
              <ul className="space-y-2">
                {canon.immutables.map((immutable: string) => (
                  <li key={immutable} className="flex items-center gap-2 font-merriweather text-sm text-iron dark:text-parchment/80">
                    <Shield className="h-4 w-4 text-amber-600" />
                    {immutable.replace(/_/g, " ")}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-iron/60 dark:text-parchment/60 font-merriweather">Loading canon...</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-iron/20 dark:border-parchment/20">
          <CardHeader>
            <CardTitle className="font-cinzel text-midnight dark:text-parchment flex items-center gap-2">
              <Eye className="h-5 w-5 text-red-600" />
              Recent Security Events
            </CardTitle>
            <CardDescription className="font-merriweather">
              Last 5 security pipeline events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {securityEvents && securityEvents.length > 0 ? (
              <ul className="space-y-2">
                {securityEvents.map((event: any) => (
                  <li key={event.id} className="flex items-center justify-between font-merriweather text-sm">
                    <span className="text-iron dark:text-parchment/80">{event.description}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.decision === "approve" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                      event.decision === "deny" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {event.decision}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-iron/60 dark:text-parchment/60 font-merriweather">No security events recorded</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
