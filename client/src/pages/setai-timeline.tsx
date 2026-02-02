import { useQuery } from "@tanstack/react-query";
import { Clock, Calendar, MapPin, Users, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CodexEvent = {
  id: number;
  eventId: string;
  timestamp: string;
  approximate: boolean;
  location: string | null;
  people: string[];
  summary: string;
  details: string | null;
  trustLevel: string;
};

export default function SetAITimeline() {
  const { data: events = [], isLoading } = useQuery<CodexEvent[]>({
    queryKey: ["/api/codex/events"],
    queryFn: async () => {
      const res = await fetch("/api/codex/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const groupedEvents = sortedEvents.reduce((acc, event) => {
    const year = new Date(event.timestamp).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<number, CodexEvent[]>);

  const getTrustColor = (level: string) => {
    switch (level) {
      case "verified": return "border-green-500 dark:border-green-400";
      case "probable": return "border-blue-500 dark:border-blue-400";
      case "possible": return "border-yellow-500 dark:border-yellow-400";
      case "uncertain": return "border-orange-500 dark:border-orange-400";
      case "contested": return "border-red-500 dark:border-red-400";
      default: return "border-gray-500 dark:border-gray-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Clock className="h-10 w-10 text-emerald-600" />
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-midnight dark:text-parchment">
            Timeline
          </h1>
          <p className="text-iron dark:text-parchment/70 font-merriweather">
            Chronological event visualization
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : events.length === 0 ? (
        <Card className="border-iron/20 dark:border-parchment/20">
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 mx-auto text-iron/40 dark:text-parchment/40 mb-4" />
            <p className="font-merriweather text-iron/60 dark:text-parchment/60">
              No events in the timeline yet. Add events in the Codex to see them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-iron/20 dark:bg-parchment/20 transform md:-translate-x-1/2"></div>

          {Object.entries(groupedEvents)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, yearEvents]) => (
              <div key={year} className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="ml-16 md:ml-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:mt-12 text-2xl font-cinzel font-bold text-midnight dark:text-parchment bg-white dark:bg-midnight px-4 z-10">
                    {year}
                  </h2>
                </div>

                <div className="space-y-6 mt-12">
                  {yearEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative flex items-start ${
                        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                      data-testid={`timeline-event-${event.id}`}
                    >
                      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 rounded-full bg-iron/40 dark:bg-parchment/40 mt-2"></div>

                      <Card
                        className={`ml-12 md:ml-0 md:w-5/12 border-l-4 ${getTrustColor(event.trustLevel)} ${
                          index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                        }`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="font-cinzel text-lg text-midnight dark:text-parchment">
                              {event.summary}
                            </CardTitle>
                            {event.approximate && (
                              <Badge variant="outline" className="text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Approx
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="font-merriweather text-sm">
                            {new Date(event.timestamp).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {event.details && (
                            <p className="font-merriweather text-sm text-iron dark:text-parchment/80 mb-3">
                              {event.details}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 text-xs text-iron/60 dark:text-parchment/60">
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            )}
                            {event.people.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {event.people.join(", ")}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
