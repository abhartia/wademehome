"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRoommate } from "@/components/providers/RoommateProvider";
import { MyRoommateProfile } from "@/lib/types/roommate";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/branding/BrandLogo";
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
  stage: number;
  agentMessage: string;
  quickReplies: string[];
  quickReplyMode: QuickReplyMode;
  profileKey: keyof MyRoommateProfile | null;
  toProfileValue?: (raw: string | string[]) => Partial<MyRoommateProfile>;
}

// ---------------------------------------------------------------------------
// Conversation script
// ---------------------------------------------------------------------------

const STEPS: ConversationStep[] = [
  {
    id: "name",
    stage: 1,
    agentMessage:
      "Let's set up your roommate profile so I can find you a great match.\n\nWhat name should we show to potential roommates?",
    quickReplies: [],
    quickReplyMode: "single",
    profileKey: "name",
  },
  {
    id: "age",
    stage: 1,
    agentMessage: "How old are you?",
    quickReplies: [],
    quickReplyMode: "single",
    profileKey: "age",
    toProfileValue: (raw) => ({
      age: Number(raw),
    }),
  },
  {
    id: "occupation",
    stage: 1,
    agentMessage: "What do you do? (student, designer, engineer, etc.)",
    quickReplies: [],
    quickReplyMode: "single",
    profileKey: "occupation",
  },
  {
    id: "sleep",
    stage: 2,
    agentMessage: "What's your sleep schedule like?",
    quickReplies: ["Early bird", "Night owl", "Flexible"],
    quickReplyMode: "single",
    profileKey: "sleepSchedule",
  },
  {
    id: "cleanliness",
    stage: 2,
    agentMessage: "How tidy do you keep your space?",
    quickReplies: ["Very tidy", "Tidy", "Relaxed"],
    quickReplyMode: "single",
    profileKey: "cleanlinessLevel",
  },
  {
    id: "noise",
    stage: 3,
    agentMessage: "How about noise and socialising at home?",
    quickReplies: [
      "Quiet -- I need focus time",
      "Moderate",
      "Social -- the more the merrier",
    ],
    quickReplyMode: "single",
    profileKey: "noiseLevel",
  },
  {
    id: "guests",
    stage: 3,
    agentMessage: "How often do you have guests over?",
    quickReplies: ["Rarely", "Sometimes", "Often"],
    quickReplyMode: "single",
    profileKey: "guestPolicy",
  },
  {
    id: "smoking",
    stage: 4,
    agentMessage: "Any hard rules on smoking?",
    quickReplies: ["No smoking", "Outside only is fine", "No preference"],
    quickReplyMode: "single",
    profileKey: "smoking",
  },
  {
    id: "languagesSpoken",
    stage: 4,
    agentMessage: "Which languages do you speak? Pick all that apply.",
    quickReplies: [
      "English",
      "Spanish",
      "Hindi",
      "Mandarin",
      "Arabic",
      "French",
      "Portuguese",
      "Bengali",
      "Urdu",
      "Korean",
      "Japanese",
      "Russian",
    ],
    quickReplyMode: "multi",
    profileKey: "languagesSpoken",
    toProfileValue: (raw) => ({
      languagesSpoken: typeof raw === "string" ? [raw] : raw,
    }),
  },
  {
    id: "preferredLanguages",
    stage: 5,
    agentMessage:
      "Which languages do you want your roommate to speak? Pick all that matter to you.",
    quickReplies: [
      "English",
      "Spanish",
      "Hindi",
      "Mandarin",
      "Arabic",
      "French",
      "Portuguese",
      "Bengali",
      "Urdu",
      "Korean",
      "Japanese",
      "Russian",
    ],
    quickReplyMode: "multi",
    profileKey: "preferredLanguages",
    toProfileValue: (raw) => ({
      preferredLanguages: typeof raw === "string" ? [raw] : raw,
    }),
  },
  {
    id: "mustHavePreferredLanguages",
    stage: 5,
    agentMessage:
      "Should I only show matches with at least one of those preferred languages?",
    quickReplies: ["Yes, only those matches", "No, keep all matches"],
    quickReplyMode: "single",
    profileKey: "mustHavePreferredLanguages",
    toProfileValue: (raw) => ({
      mustHavePreferredLanguages: raw === "Yes, only those matches",
    }),
  },
  {
    id: "interests",
    stage: 6,
    agentMessage:
      "What are you into? Pick a few so I can find someone you'd click with.",
    quickReplies: [
      "Cooking",
      "Gaming",
      "Fitness",
      "Music",
      "Reading",
      "Hiking",
      "Movies",
      "Art",
      "Sports",
      "Travel",
      "Photography",
      "Tech",
    ],
    quickReplyMode: "multi",
    profileKey: "interests",
    toProfileValue: (raw) => ({
      interests: typeof raw === "string" ? [raw] : raw,
    }),
  },
  {
    id: "bio",
    stage: 6,
    agentMessage:
      "Last thing -- write a short bio about yourself. Just a sentence or two so potential roommates know who you are.",
    quickReplies: [],
    quickReplyMode: "single",
    profileKey: "bio",
  },
];

const TOTAL_STAGES = 6;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ChatBubble({ role, content }: { role: "agent" | "user"; content: string }) {
  const isAgent = role === "agent";
  return (
    <div
      className={`flex ${isAgent ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      {isAgent && (
        <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
          <BrandLogo className="h-4 w-4 text-primary-foreground" title="Assistant" />
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
  if (options.length === 0) return null;
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

function SummaryCard({
  profile,
  onConfirm,
  onReset,
}: {
  profile: MyRoommateProfile;
  onConfirm: () => void;
  onReset: () => void;
}) {
  const rows = [
    { label: "Name", value: profile.name || "—" },
    { label: "Age", value: profile.age > 0 ? String(profile.age) : "—" },
    { label: "Occupation", value: profile.occupation || "—" },
    { label: "Sleep", value: profile.sleepSchedule || "—" },
    { label: "Tidiness", value: profile.cleanlinessLevel || "—" },
    { label: "Noise", value: profile.noiseLevel || "—" },
    { label: "Guests", value: profile.guestPolicy || "—" },
    { label: "Smoking", value: profile.smoking || "—" },
    {
      label: "Speak",
      value:
        profile.languagesSpoken.length > 0
          ? profile.languagesSpoken.join(", ")
          : "—",
    },
    {
      label: "Prefer",
      value:
        profile.preferredLanguages.length > 0
          ? profile.preferredLanguages.join(", ")
          : "—",
    },
    {
      label: "Language filter",
      value: profile.mustHavePreferredLanguages ? "Strict" : "Flexible",
    },
    {
      label: "Interests",
      value: profile.interests.length > 0 ? profile.interests.join(", ") : "—",
    },
    { label: "Bio", value: profile.bio || "—" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ml-9 max-w-md rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold">Your roommate profile:</h3>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2 text-sm">
            <span className="w-20 shrink-0 text-muted-foreground">{r.label}</span>
            <span className="font-medium">{r.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={onConfirm} className="rounded-full">
          Find my matches!
        </Button>
        <Button variant="outline" onClick={onReset} className="rounded-full">
          Start over
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function RoommateProfileChat({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const { myProfile, updateMyProfile, resetMyProfile } = useRoommate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedReplies, setSelectedReplies] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [finished, setFinished] = useState(false);
  const [draftProfile, setDraftProfile] = useState<MyRoommateProfile>(myProfile);

  const scrollRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (hasInitialised.current) return;
    hasInitialised.current = true;

    if (myProfile.profileCompleted) {
      setDraftProfile(myProfile);
      setShowSummary(true);
      setFinished(true);
      addMessage("agent", "Welcome back! Here's your roommate profile.");
    } else {
      addMessage("agent", STEPS[0].agentMessage);
    }
  }, [addMessage, myProfile, myProfile.profileCompleted]);

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
          addMessage("agent", "Here's your roommate profile summary.");
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
      let nextPartial: Partial<MyRoommateProfile> = {};
      if (step.toProfileValue) {
        nextPartial = step.toProfileValue(answer);
      } else if (step.profileKey) {
        nextPartial = {
          [step.profileKey]: answer,
        } as Partial<MyRoommateProfile>;
      }
      updateMyProfile(nextPartial);
      setDraftProfile((prev) => ({ ...prev, ...nextPartial }));
    },
    [updateMyProfile],
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
    if (currentStep.id === "age") {
      const parsed = Number(text);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        addMessage("agent", "Please enter a valid age as a number.");
        return;
      }
    }
    addMessage("user", text);
    applyAnswer(currentStep, text);
    setInputValue("");
    advanceToNextStep(currentStepIdx);
  };

  const handleConfirmProfile = () => {
    updateMyProfile({ profileCompleted: true });
    setFinished(true);
    addMessage("agent", "Profile saved! Let's find your matches.");
    onComplete?.();
  };

  const handleReset = () => {
    resetMyProfile();
    setDraftProfile({
      ...myProfile,
      profileCompleted: false,
      name: "",
      age: 0,
      occupation: "",
      sleepSchedule: "",
      cleanlinessLevel: "",
      noiseLevel: "",
      guestPolicy: "",
      smoking: "",
      languagesSpoken: [],
      preferredLanguages: [],
      mustHavePreferredLanguages: false,
      interests: [],
      bio: "",
    });
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
      <div className="shrink-0 px-4 pt-3 pb-2">
        <div className="mx-auto max-w-2xl">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Roommate profile</span>
            <span>
              {showSummary ? "Review" : `${currentStage} of ${TOTAL_STAGES}`}
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}

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

          {showSummary && !finished && (
            <SummaryCard
              profile={draftProfile}
              onConfirm={handleConfirmProfile}
              onReset={handleReset}
            />
          )}
          {showSummary && finished && (
            <SummaryCard
              profile={draftProfile}
              onConfirm={() => onComplete?.()}
              onReset={handleReset}
            />
          )}
        </div>
      </div>

      {!showSummary && !finished && (
        <div className="shrink-0 border-t bg-background px-4 py-3">
          <form
            onSubmit={handleFreeTextSubmit}
            className="mx-auto flex max-w-2xl items-center gap-2"
          >
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                currentStep?.id === "bio"
                  ? "e.g. Grad student at NYU, love cooking and hiking..."
                  : currentStep?.id === "age"
                    ? "e.g. 24"
                    : "Or type your answer..."
              }
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
