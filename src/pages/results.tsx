import { useLocation } from "wouter";
import { useGetSurveyResponsesSummary } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Users, RotateCcw, BarChart2 } from "lucide-react";

const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const REFERRAL_LABELS: Record<string, string> = {
  friend: "A friend",
  social_media: "Social media",
  search: "Search engine",
  other: "Other",
};

const INTEREST_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  design: "Design",
  devops: "DevOps",
};

function BreakdownBar({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium tabular-nums w-10 text-right">{count}</span>
    </div>
  );
}

export default function Results() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);

  const submittedName = params.get("name") ?? "";
  const submittedExperience = params.get("experience") ?? "";
  const submittedReferral = params.get("referral") ?? "";
  const submittedInterests = (params.get("interests") ?? "").split(",").filter(Boolean);

  const { data: summary, isLoading } = useGetSurveyResponsesSummary();

  const total = summary?.total ?? 0;
  const experienceBreakdown = summary?.experience_breakdown ?? {};
  const referralBreakdown = summary?.referral_breakdown ?? {};
  const interestsBreakdown = summary?.interests_breakdown ?? {};

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">

        {/* Success banner */}
        <div
          className="flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/20 px-4 py-3"
          data-testid="banner-success"
        >
          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm font-medium text-primary">
            Thanks for completing the survey, {submittedName}!
          </p>
        </div>

        {/* Submitted answers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center" data-testid="answer-name">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{submittedName}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center" data-testid="answer-experience">
                <span className="text-sm text-muted-foreground">Experience level</span>
                <Badge variant="secondary">
                  {EXPERIENCE_LABELS[submittedExperience] ?? submittedExperience}
                </Badge>
              </div>

              <Separator />

              <div className="flex justify-between items-center" data-testid="answer-referral">
                <span className="text-sm text-muted-foreground">How they found us</span>
                <span className="text-sm font-medium">
                  {REFERRAL_LABELS[submittedReferral] ?? submittedReferral}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-start" data-testid="answer-interests">
                <span className="text-sm text-muted-foreground">Interests</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                  {submittedInterests.map((interest) => (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {INTEREST_LABELS[interest] ?? interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total responses */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4" data-testid="stat-total-responses">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? "…" : total}
                </p>
                <p className="text-sm text-muted-foreground">
                  {total === 1 ? "response submitted" : "responses submitted"} so far
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aggregate summary */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5" data-testid="section-summary">

            {/* Experience breakdown */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Experience level
              </p>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : (
                Object.entries(EXPERIENCE_LABELS).map(([key, label]) => (
                  <BreakdownBar
                    key={key}
                    label={label}
                    count={experienceBreakdown[key] ?? 0}
                    total={total}
                  />
                ))
              )}
            </div>

            <Separator />

            {/* Referral breakdown */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                How they found us
              </p>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : (
                Object.entries(REFERRAL_LABELS).map(([key, label]) => (
                  <BreakdownBar
                    key={key}
                    label={label}
                    count={referralBreakdown[key] ?? 0}
                    total={total}
                  />
                ))
              )}
            </div>

            <Separator />

            {/* Interests breakdown */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Interests
              </p>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : (
                Object.entries(INTEREST_LABELS).map(([key, label]) => (
                  <BreakdownBar
                    key={key}
                    label={label}
                    count={interestsBreakdown[key] ?? 0}
                    total={total}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Take again */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setLocation("/")}
          data-testid="button-take-again"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Take the survey again
        </Button>
      </div>
    </div>
  );
}
