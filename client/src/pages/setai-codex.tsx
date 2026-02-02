import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, FileText, FolderOpen, Plus, Calendar, MapPin, Users, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type CodexEvent = {
  id: number;
  eventId: string;
  timestamp: string;
  approximate: boolean;
  location: string | null;
  people: string[];
  institutions: string[];
  summary: string;
  details: string | null;
  tags: string[];
  source: string;
  trustLevel: string;
};

type CodexDocument = {
  id: number;
  documentId: string;
  title: string;
  path: string | null;
  type: string;
  summary: string | null;
  source: string;
};

type CodexProject = {
  id: number;
  projectId: string;
  name: string;
  status: string;
  description: string | null;
  tags: string[];
};

export default function SetAICodex() {
  const [activeTab, setActiveTab] = useState("events");
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [trustLevel, setTrustLevel] = useState("probable");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery<CodexEvent[]>({
    queryKey: ["/api/codex/events"],
    queryFn: async () => {
      const res = await fetch("/api/codex/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  const { data: documents = [] } = useQuery<CodexDocument[]>({
    queryKey: ["/api/codex/documents"],
    queryFn: async () => {
      const res = await fetch("/api/codex/documents");
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
  });

  const { data: projects = [] } = useQuery<CodexProject[]>({
    queryKey: ["/api/codex/projects"],
    queryFn: async () => {
      const res = await fetch("/api/codex/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/codex/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, consent: true }),
      });
      if (!res.ok) throw new Error("Failed to create event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/codex/events"] });
      setIsAddEventOpen(false);
      toast({ title: "Event created", description: "The codex event has been recorded." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const eventId = `evt-${Date.now()}`;
    createEventMutation.mutate({
      eventId,
      timestamp: new Date(formData.get("timestamp") as string).toISOString(),
      approximate: false,
      location: formData.get("location") || null,
      people: (formData.get("people") as string)?.split(",").map(p => p.trim()).filter(Boolean) || [],
      institutions: [],
      summary: formData.get("summary"),
      details: formData.get("details") || null,
      tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [],
      source: "user",
      trustLevel,
    });
    setTrustLevel("probable");
  };

  const getTrustBadgeColor = (level: string) => {
    switch (level) {
      case "verified": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "probable": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "possible": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "uncertain": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "contested": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="h-10 w-10 text-amber-600" />
          <div>
            <h1 className="text-3xl font-cinzel font-bold text-midnight dark:text-parchment">
              Codex
            </h1>
            <p className="text-iron dark:text-parchment/70 font-merriweather">
              Events, documents, and projects archive
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events" className="font-cinzel" data-testid="tab-events">
            <Calendar className="h-4 w-4 mr-2" />
            Events ({events.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="font-cinzel" data-testid="tab-documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="projects" className="font-cinzel" data-testid="tab-projects">
            <FolderOpen className="h-4 w-4 mr-2" />
            Projects ({projects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <DialogTrigger asChild>
                <Button className="font-cinzel" data-testid="button-add-event">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-cinzel">Add Codex Event</DialogTitle>
                  <DialogDescription className="font-merriweather">
                    Record a new event in the chronological archive
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEvent} className="space-y-4" data-testid="form-add-event">
                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary *</Label>
                    <Input id="summary" name="summary" required placeholder="Brief event description" data-testid="input-summary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timestamp">Date *</Label>
                      <Input id="timestamp" name="timestamp" type="datetime-local" required data-testid="input-timestamp" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trustLevel">Trust Level</Label>
                      <Select value={trustLevel} onValueChange={setTrustLevel}>
                        <SelectTrigger data-testid="select-trust-level">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="verified" data-testid="option-verified">Verified</SelectItem>
                          <SelectItem value="probable" data-testid="option-probable">Probable</SelectItem>
                          <SelectItem value="possible" data-testid="option-possible">Possible</SelectItem>
                          <SelectItem value="uncertain" data-testid="option-uncertain">Uncertain</SelectItem>
                          <SelectItem value="contested" data-testid="option-contested">Contested</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" placeholder="Where this occurred" data-testid="input-location" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="people">People (comma-separated)</Label>
                    <Input id="people" name="people" placeholder="Person 1, Person 2" data-testid="input-people" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" name="tags" placeholder="tag1, tag2" data-testid="input-tags" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="details">Details</Label>
                    <Textarea id="details" name="details" placeholder="Full event details..." rows={3} data-testid="input-details" />
                  </div>
                  <Button type="submit" className="w-full font-cinzel" disabled={createEventMutation.isPending} data-testid="button-submit-event">
                    {createEventMutation.isPending ? "Creating..." : "Create Event"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {events.length === 0 ? (
            <Card className="border-iron/20 dark:border-parchment/20">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-iron/40 dark:text-parchment/40 mb-4" />
                <p className="font-merriweather text-iron/60 dark:text-parchment/60">
                  No events recorded yet. Add your first event to begin.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id} className="border-iron/20 dark:border-parchment/20" data-testid={`card-event-${event.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="font-cinzel text-midnight dark:text-parchment">
                          {event.summary}
                        </CardTitle>
                        <CardDescription className="font-merriweather flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.timestamp).toLocaleDateString()}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                          )}
                          {event.people.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.people.length} people
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <Badge className={getTrustBadgeColor(event.trustLevel)}>
                        {event.trustLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  {(event.details || event.tags.length > 0) && (
                    <CardContent>
                      {event.details && (
                        <p className="font-merriweather text-iron dark:text-parchment/80 mb-4">
                          {event.details}
                        </p>
                      )}
                      {event.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="h-4 w-4 text-iron/60" />
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="font-merriweather">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {documents.length === 0 ? (
            <Card className="border-iron/20 dark:border-parchment/20">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-iron/40 dark:text-parchment/40 mb-4" />
                <p className="font-merriweather text-iron/60 dark:text-parchment/60">
                  No documents archived yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="border-iron/20 dark:border-parchment/20" data-testid={`card-document-${doc.id}`}>
                  <CardHeader>
                    <CardTitle className="font-cinzel text-midnight dark:text-parchment flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {doc.title}
                    </CardTitle>
                    <CardDescription className="font-merriweather">
                      Type: {doc.type} | Source: {doc.source}
                    </CardDescription>
                  </CardHeader>
                  {doc.summary && (
                    <CardContent>
                      <p className="font-merriweather text-iron dark:text-parchment/80">
                        {doc.summary}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {projects.length === 0 ? (
            <Card className="border-iron/20 dark:border-parchment/20">
              <CardContent className="py-12 text-center">
                <FolderOpen className="h-12 w-12 mx-auto text-iron/40 dark:text-parchment/40 mb-4" />
                <p className="font-merriweather text-iron/60 dark:text-parchment/60">
                  No projects tracked yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="border-iron/20 dark:border-parchment/20" data-testid={`card-project-${project.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="font-cinzel text-midnight dark:text-parchment">
                        {project.name}
                      </CardTitle>
                      <Badge className={
                        project.status === "active" ? "bg-green-100 text-green-800" :
                        project.status === "completed" ? "bg-blue-100 text-blue-800" :
                        project.status === "paused" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }>
                        {project.status}
                      </Badge>
                    </div>
                    {project.description && (
                      <CardDescription className="font-merriweather">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  {project.tags.length > 0 && (
                    <CardContent>
                      <div className="flex items-center gap-2 flex-wrap">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="font-merriweather">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
