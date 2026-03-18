"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { UserProfile } from "@/lib/types/userProfile";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: "agent" | "user";
  content: string;
}

type QuickReplyMode = "single" | "multi";

interface ConversationStep {
  id: string;
  stage: number; // 1-5
  agentMessage: string;
  quickReplies: string[];
  quickReplyMode: QuickReplyMode;
  profileKey: keyof UserProfile | null;
  toProfileValue?: (raw: string | string[]) => Partial<UserProfile>;
}

// ---------------------------------------------------------------------------
// Conversation script
// ---------------------------------------------------------------------------

const STEPS: ConversationStep[] = [
  {
    id: "trigger",
    stage: 1,
    agentMessage:
      "Hey! Let's get to know what you're looking for so I can help you find the perfect place.\n\nFirst -- what's prompting your apartment search?",
    quickReplies: [
      "Lease is ending",
      "Job relocation",
      "Lifestyle upgrade",
      "Moving in with someone",
      "Just browsing",
      "Something else",
    ],
    quickReplyMode: "single",
    profileKey: "triggerReason",
    toProfileValue: (raw) => {
      const val = typeof raw === "string" ? raw : raw[0];
      const isReactive = ["Lease is ending", "Job relocation"].includes(val);
      return {
        searchTrigger: isReactive ? "reactive" : "proactive",
        triggerReason: val,
      };
    },
  },
  {
    id: "timeline",
    stage: 1,
    agentMessage: "And when are you looking to move?",
    quickReplies: ["ASAP", "1-2 months", "3-6 months", "No rush, just exploring"],
    quickReplyMode: "single",
    profileKey: "moveTimeline",
  },
  {
    id: "city",
    stage: 2,
    agentMessage:
      "Great. Where are you hoping to live? If you're not sure yet, just tell me what matters most or type a city.",
    quickReplies: [
      "New York",
      "Los Angeles",
      "Chicago",
      "Austin",
      "Miami",
      "San Francisco",
      "Other...",
    ],
    quickReplyMode: "single",
    profileKey: "preferredCities",
    toProfileValue: (raw) => {
      const val = typeof raw === "string" ? raw : raw[0];
      return { preferredCities: [val] };
    },
  },
  {
    id: "work",
    stage: 2,
    agentMessage:
      "Where do you work or study? This helps me factor in your commute.",
    quickReplies: ["Skip"],
    quickReplyMode: "single",
    profileKey: "workLocation",
  },
  {
    id: "neighbourhood",
    stage: 3,
    agentMessage:
      "What's most important to you in a neighbourhood? Pick as many as you like, or tell me in your own words.",
    quickReplies: [
      "Walkable",
      "Good restaurants",
      "Parks & green space",
      "Nightlife",
      "Near grocery stores",
      "Good schools",
      "Safe & quiet",
      "Near public transit",
      "Parking available",
      "Gym nearby",
    ],
    quickReplyMode: "multi",
    profileKey: "neighbourhoodPriorities",
    toProfileValue: (raw) => ({
      neighbourhoodPriorities: typeof raw === "string" ? [raw] : raw,
    }),
  },
  {
    id: "dealbreakers",
    stage: 3,
    agentMessage:
      "Any dealbreakers -- things you absolutely want to avoid?",
    quickReplies: [
      "Flood zone",
      "High crime area",
      "No street parking",
      "Far from transit",
      "Noisy area",
      "None of these",
    ],
    quickReplyMode: "multi",
    profileKey: "dealbreakers",
    toProfileValue: (raw) => {
      const vals = typeof raw === "string" ? [raw] : raw;
      return { dealbreakers: vals.filter((v) => v !== "None of these") };
    },
  },
  {
    id: "budget",
    stage: 4,
    agentMessage:
      "Let's talk budget. What's the most you'd want to spend on rent each month?",
    quickReplies: [
      "Under $1,000",
      "$1,000 - $1,500",
      "$1,500 - $2,000",
      "$2,000 - $3,000",
      "$3,000 - $5,000",
      "$5,000+",
    ],
    quickReplyMode: "single",
    profileKey: "maxMonthlyRent",
  },
  {
    id: "credit",
    stage: 4,
    agentMessage:
      "Do you know your credit score range? This helps with application planning. Totally fine to skip.",
    quickReplies: [
      "Excellent (750+)",
      "Good (700-749)",
      "Fair (650-699)",
      "Below 650",
      "Not sure",
      "Skip",
    ],
    quickReplyMode: "single",
    profileKey: "creditScoreRange",
    toProfileValue: (raw) => {
      const val = typeof raw === "string" ? raw : raw[0];
      return { creditScoreRange: val === "Skip" ? "" : val };
    },
  },
  {
    id: "living",
    stage: 5,
    agentMessage: "Last stretch -- who's moving in?",
    quickReplies: ["Just me", "Me + roommate(s)", "Me + partner", "My family"],
    quickReplyMode: "single",
    profileKey: "livingArrangement",
    toProfileValue: (raw) => {
      const val = typeof raw === "string" ? raw : raw[0];
      const map: Record<string, UserProfile["livingArrangement"]> = {
        "Just me": "solo",
        "Me + roommate(s)": "roommates",
        "Me + partner": "partner",
        "My family": "family",
      };
      return { livingArrangement: map[val] ?? "solo" };
    },
  },
  {
    id: "bedrooms",
    stage: 5,
    agentMessage: "How many bedrooms do you need?",
    quickReplies: ["Studio", "1 bedroom", "2 bedrooms", "3 bedrooms", "4+ bedrooms"],
    quickReplyMode: "single",
    profileKey: "bedroomsNeeded",
  },
  {
    id: "pets",
    stage: 5,
    agentMessage: "Any pets coming along?",
    quickReplies: ["No pets", "Dog", "Cat", "Other"],
    quickReplyMode: "single",
    profileKey: "petDetails",
    toProfileValue: (raw) => {
      const val = typeof raw === "string" ? raw : raw[0];
      return {
        hasPets: val !== "No pets",
        petDetails: val === "No pets" ? "" : val,
      };
    },
  },
];

const TOTAL_STAGES = 5;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ChatBubble({
  role,
  content,
}: {
  role: "agent" | "user";
  content: string;
}) {
  const isAgent = role === "agent";
  return (
    <div
      className={`flex ${isAgent ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      {isAgent && (
        <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
          <img src="/favicon.ico" alt="" className="h-4 w-4 brightness-0 invert" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
          isAgent
            ? "bg-muted text-foreground rounded-tl-md"
            : "bg-primary text-primary-foreground rounded-tr-md"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function QuickReplyChips({
  options,
  mode,
  selected,
  onSelect,
  onConfirm,
  disabled,
}: {
  options: string[];
  mode: QuickReplyMode;
  selected: string[];
  onSelect: (option: string) => void;
  onConfirm: () => void;
  disabled: boolean;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-2 pl-9">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              disabled={disabled}
              onClick={() => onSelect(opt)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-foreground hover:border-primary/50 hover:bg-accent"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {mode === "multi" && selected.length > 0 && !disabled && (
        <div className="flex">
          <Button size="sm" onClick={onConfirm} className="rounded-full">
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ onConfirm, onReset }: { onConfirm: () => void; onReset: () => void }) {
  const { profile } = useUserProfile();

  const rows: { label: string; value: string }[] = [
    { label: "Reason", value: profile.triggerReason || "—" },
    { label: "Timeline", value: profile.moveTimeline || "—" },
    {
      label: "Target cities",
      value: profile.preferredCities.join(", ") || "—",
    },
    { label: "Work / study", value: profile.workLocation || "—" },
    {
      label: "Neighbourhood",
      value: profile.neighbourhoodPriorities.join(", ") || "—",
    },
    {
      label: "Dealbreakers",
      value: profile.dealbreakers.length > 0 ? profile.dealbreakers.join(", ") : "None",
    },
    { label: "Budget", value: profile.maxMonthlyRent || "—" },
    { label: "Credit", value: profile.creditScoreRange || "—" },
    {
      label: "Living",
      value: profile.livingArrangement ?? "—",
    },
    { label: "Bedrooms", value: profile.bedroomsNeeded || "—" },
    {
      label: "Pets",
      value: profile.hasPets ? profile.petDetails : "None",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ml-9 max-w-md rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold">Here&apos;s what I&apos;ve got:</h3>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2 text-sm">
            <span className="w-28 shrink-0 text-muted-foreground">{r.label}</span>
            <span className="font-medium">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={onConfirm} className="rounded-full">
          Looks good, let&apos;s go!
        </Button>
        <Button variant="outline" onClick={onReset} className="rounded-full">
          Start over
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main OnboardingChat component
// ---------------------------------------------------------------------------

export function OnboardingChat() {
  const router = useRouter();
  const { profile, updateProfile, resetProfile } = useUserProfile();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedReplies, setSelectedReplies] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [finished, setFinished] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialised = useRef(false);

  const currentStep = STEPS[currentStepIdx] as ConversationStep | undefined;
  const currentStage = currentStep?.stage ?? TOTAL_STAGES;
  const progressPercent = showSummary
    ? 100
    : ((currentStage - 1) / TOTAL_STAGES) * 100;

  const addMessage = useCallback(
    (role: "agent" | "user", content: string) => {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, role, content },
      ]);
    },
    [],
  );

  // Show first agent message on mount
  useEffect(() => {
    if (hasInitialised.current) return;
    hasInitialised.current = true;

    if (profile.onboardingCompleted) {
      setShowSummary(true);
      setFinished(true);
      addMessage("agent", "Welcome back! Here's your profile summary.");
    } else {
      addMessage("agent", STEPS[0].agentMessage);
    }
  }, [addMessage, profile.onboardingCompleted]);

  // Auto-scroll to bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [messages, showSummary, selectedReplies]);

  const advanceToNextStep = useCallback(
    (fromIdx: number) => {
      const nextIdx = fromIdx + 1;
      if (nextIdx >= STEPS.length) {
        setShowSummary(true);
        setTimeout(() => {
          addMessage(
            "agent",
            "That's everything! Here's a summary of your preferences.",
          );
        }, 400);
      } else {
        setCurrentStepIdx(nextIdx);
        setTimeout(() => {
          addMessage("agent", STEPS[nextIdx].agentMessage);
        }, 400);
      }
    },
    [addMessage],
  );

  const applyAnswer = useCallback(
    (step: ConversationStep, answer: string | string[]) => {
      if (step.toProfileValue) {
        updateProfile(step.toProfileValue(answer));
      } else if (step.profileKey) {
        updateProfile({
          [step.profileKey]: answer,
          onboardingStep: step.stage,
        } as Partial<UserProfile>);
      }
    },
    [updateProfile],
  );

  const handleQuickReplySelect = (option: string) => {
    if (!currentStep || finished) return;

    if (currentStep.quickReplyMode === "single") {
      addMessage("user", option);
      setSelectedReplies([]);
      applyAnswer(currentStep, option);
      advanceToNextStep(currentStepIdx);
    } else {
      setSelectedReplies((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option],
      );
    }
  };

  const handleMultiConfirm = () => {
    if (!currentStep || selectedReplies.length === 0) return;
    addMessage("user", selectedReplies.join(", "));
    applyAnswer(currentStep, selectedReplies);
    setSelectedReplies([]);
    advanceToNextStep(currentStepIdx);
  };

  const handleFreeTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || !currentStep || finished) return;

    addMessage("user", text);
    applyAnswer(currentStep, text);
    setInputValue("");
    advanceToNextStep(currentStepIdx);
  };

  const handleConfirmProfile = () => {
    updateProfile({ onboardingCompleted: true });
    setFinished(true);
    addMessage(
      "agent",
      "You're all set! I'll use these preferences to personalise your search experience. Head to Search whenever you're ready.",
    );
    setTimeout(() => router.push("/"), 1500);
  };

  const handleReset = () => {
    resetProfile();
    setMessages([]);
    setCurrentStepIdx(0);
    setSelectedReplies([]);
    setShowSummary(false);
    setFinished(false);
    hasInitialised.current = false;
    setTimeout(() => {
      hasInitialised.current = true;
      addMessage("agent", STEPS[0].agentMessage);
    }, 100);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Progress bar */}
      <div className="shrink-0 px-4 pt-3 pb-2">
        <div className="mx-auto max-w-2xl">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Getting to know you</span>
            <span>
              {showSummary
                ? "Review"
                : `${currentStage} of ${TOTAL_STAGES}`}
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}

          {/* Quick replies for current step */}
          {currentStep && !showSummary && !finished && (
            <QuickReplyChips
              options={currentStep.quickReplies}
              mode={currentStep.quickReplyMode}
              selected={selectedReplies}
              onSelect={handleQuickReplySelect}
              onConfirm={handleMultiConfirm}
              disabled={finished}
            />
          )}

          {/* Summary card */}
          {showSummary && !finished && (
            <SummaryCard
              onConfirm={handleConfirmProfile}
              onReset={handleReset}
            />
          )}

          {/* Completed summary (re-visit) */}
          {showSummary && finished && (
            <SummaryCard
              onConfirm={() => router.push("/")}
              onReset={handleReset}
            />
          )}
        </div>
      </div>

      {/* Text input */}
      {!showSummary && !finished && (
        <div className="shrink-0 border-t bg-background px-4 py-3">
          <form
            onSubmit={handleFreeTextSubmit}
            className="mx-auto flex max-w-2xl items-center gap-2"
          >
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Or type your answer..."
              className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim()}
              className="h-9 w-9 shrink-0 rounded-full"
            >
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
