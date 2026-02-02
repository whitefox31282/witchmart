import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Shield, CheckCircle, XCircle, AlertCircle, Activity, Eye, Lock, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type SecurityEvent = {
  id: number;
  eventId: string;
  stage: string;
  level: string;
  description: string;
  decision: string;
  createdAt: string;
};

type PipelineStage = {
  name: string;
  order: number;
  description: string;
  checks: string[];
  decisions: string[];
};

type Pipeline = {
  version: string;
  stages: PipelineStage[];
  rules: string[];
};

type Policy = {
  policy_id: string;
  scope: string;
  description: string;
  action: string;
  log: boolean;
};

export default function SetAISecurity() {
  const { data: events = [] } = useQuery<SecurityEvent[]>({
    queryKey: ["/api/security/events"],
    queryFn: async () => {
      const res = await fetch("/api/security/events");
      if (!res.ok) throw new Error("Failed to fetch security events");
      return res.json();
    },
  });

  const { data: pipeline } = useQuery<Pipeline>({
    queryKey: ["/api/security_pipeline"],
    queryFn: async () => {
      const res = await fetch("/api/security_pipeline");
      if (!res.ok) throw new Error("Failed to fetch pipeline");
      return res.json();
    },
  });

  const { data: policiesData } = useQuery<{ policies: Policy[] }>({
    queryKey: ["/api/guardian_policies"],
    queryFn: async () => {
      const res = await fetch("/api/guardian_policies");
      if (!res.ok) throw new Error("Failed to fetch policies");
      return res.json();
    },
  });

  const policies = policiesData?.policies || [];

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case "approve":
      case "green":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "deny":
      case "block":
      case "red":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "escalate":
      case "yellow":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "sanitize":
        return <Shield className="h-5 w-5 text-blue-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case "network": return <Activity className="h-4 w-4" />;
      case "output": return <Eye className="h-4 w-4" />;
      case "codex": return <Lock className="h-4 w-4" />;
      case "mode": return <Layers className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <AlertTriangle className="h-10 w-10 text-red-600" />
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-midnight dark:text-parchment">
            Security
          </h1>
          <p className="text-iron dark:text-parchment/70 font-merriweather">
            Pipeline status and event monitoring
          </p>
        </div>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pipeline" className="font-cinzel" data-testid="tab-pipeline">
            <Layers className="h-4 w-4 mr-2" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="events" className="font-cinzel" data-testid="tab-events">
            <Activity className="h-4 w-4 mr-2" />
            Events ({events.length})
          </TabsTrigger>
          <TabsTrigger value="policies" className="font-cinzel" data-testid="tab-policies">
            <Shield className="h-4 w-4 mr-2" />
            Policies ({policies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <Card className="border-iron/20 dark:border-parchment/20">
            <CardHeader>
              <CardTitle className="font-cinzel text-midnight dark:text-parchment">
                Security Pipeline
              </CardTitle>
              <CardDescription className="font-merriweather">
                4-stage security evaluation for all requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pipeline?.stages ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Progress value={100} className="flex-1" />
                    <span className="text-sm font-merriweather text-green-600 dark:text-green-400">
                      All stages operational
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pipeline.stages.map((stage, index) => (
                      <Card key={stage.name} className="border-iron/20 dark:border-parchment/20" data-testid={`pipeline-stage-${stage.name}`}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-800 dark:text-amber-400 font-bold text-sm">
                              {stage.order}
                            </div>
                            <CardTitle className="font-cinzel text-base capitalize">
                              {stage.name}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="font-merriweather text-sm text-iron dark:text-parchment/70 mb-3">
                            {stage.description}
                          </p>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-iron/60 dark:text-parchment/60 uppercase">
                              Checks
                            </p>
                            <ul className="space-y-1">
                              {stage.checks.map((check) => (
                                <li key={check} className="flex items-center gap-2 text-xs font-merriweather">
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  {check.replace(/_/g, " ")}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="border-iron/20 dark:border-parchment/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-cinzel text-base">Pipeline Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pipeline.rules.map((rule, index) => (
                          <li key={index} className="flex items-start gap-2 font-merriweather text-sm text-iron dark:text-parchment/80">
                            <span className="text-amber-600 font-bold">{index + 1}.</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-iron/60 dark:text-parchment/60 font-merriweather">
                  Loading pipeline configuration...
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {events.length === 0 ? (
            <Card className="border-iron/20 dark:border-parchment/20">
              <CardContent className="py-12 text-center">
                <Activity className="h-12 w-12 mx-auto text-iron/40 dark:text-parchment/40 mb-4" />
                <p className="font-merriweather text-iron/60 dark:text-parchment/60">
                  No security events recorded yet. Events will appear here as the pipeline processes requests.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id} className="border-iron/20 dark:border-parchment/20" data-testid={`security-event-${event.id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getDecisionIcon(event.decision)}
                        <div>
                          <CardTitle className="font-cinzel text-base text-midnight dark:text-parchment">
                            {event.description}
                          </CardTitle>
                          <CardDescription className="font-merriweather">
                            Stage: {event.stage} | {new Date(event.createdAt).toLocaleString()}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getLevelBadgeColor(event.level)}>
                          {event.level}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {event.decision}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          {policies.length === 0 ? (
            <Card className="border-iron/20 dark:border-parchment/20">
              <CardContent className="py-12 text-center">
                <Shield className="h-12 w-12 mx-auto text-iron/40 dark:text-parchment/40 mb-4" />
                <p className="font-merriweather text-iron/60 dark:text-parchment/60">
                  No guardian policies loaded.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policies.map((policy) => (
                <Card key={policy.policy_id} className="border-iron/20 dark:border-parchment/20" data-testid={`policy-${policy.policy_id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getScopeIcon(policy.scope)}
                        <CardTitle className="font-cinzel text-base text-midnight dark:text-parchment">
                          {policy.policy_id}
                        </CardTitle>
                      </div>
                      <Badge className={
                        policy.action === "allow" ? "bg-green-100 text-green-800" :
                        policy.action === "block" ? "bg-red-100 text-red-800" :
                        policy.action === "sanitize" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }>
                        {policy.action}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-merriweather text-sm text-iron dark:text-parchment/80 mb-2">
                      {policy.description}
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        Scope: {policy.scope}
                      </Badge>
                      {policy.log && (
                        <Badge variant="outline" className="text-xs">
                          Logging enabled
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
