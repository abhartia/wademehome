"use client";

import { ChatInput, ChatSection as ChatSectionUI } from "@llamaindex/chat-ui";
import { Suspense, useState } from "react";

import "@llamaindex/chat-ui/styles/editor.css";
import "@llamaindex/chat-ui/styles/markdown.css";
import "@llamaindex/chat-ui/styles/pdf.css";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { DEFAULT_BROWSE_MAP_CENTER } from "@/lib/map/defaultBrowseCenter";
import CustomChatMessages from "./CustomMessages";
import { QuestionSuggestions } from "./QuestionSuggestions";
import { useChat } from "ai/react";
import {
  PropertyDataItem,
  UIEventsTypesEnum,
  UIPropertyListingAnnotation,
} from "./annotations/UIEventsTypes";
import { PropertyList } from "./annotations/PropertyListings/PropertyListings";
import { PropertyListingsMap } from "./annotations/PropertyListings/PropertyListingsMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useUserProfile } from "./providers/UserProfileProvider";
import { Badge } from "./ui/badge";
import { SquarePen } from "lucide-react";
import { Button } from "./ui/button";
import { PropertyDetailSheet } from "./properties/PropertyDetailSheet";

interface Props {
  chatUrl: string;
  questionSuggestions?: string[];
}

interface ListingsSidebarProps {
  properties: PropertyDataItem[];
  selectedProperty: PropertyDataItem | null;
  onSelectProperty: (property: PropertyDataItem) => void;
}

const ListingsSidebar = ({
  properties,
  selectedProperty,
  onSelectProperty,
}: ListingsSidebarProps) => {
  if (!properties || properties.length === 0) return null;

  return (
    <aside className="flex h-full flex-col gap-3 pb-2">
      <Tabs defaultValue="map" className="flex h-full flex-col">
        <div className="mb-1 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Listings
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Results from your latest search.
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="map" className="flex-1 overflow-hidden">
          <PropertyListingsMap
            properties={properties}
            fallbackCenter={DEFAULT_BROWSE_MAP_CENTER}
            onSelectProperty={onSelectProperty}
          />
        </TabsContent>

        <TabsContent value="list" className="flex-1 overflow-y-auto pr-1">
          <PropertyList
            properties={properties}
            selectedProperty={selectedProperty}
            onSelectProperty={onSelectProperty}
          />
        </TabsContent>
      </Tabs>
    </aside>
  );
};

function ProfileContextBadge() {
  const { profile } = useUserProfile();
  if (!profile.onboardingCompleted) return null;

  const parts: string[] = [];
  if (profile.preferredCities.length > 0)
    parts.push(profile.preferredCities.slice(0, 2).join(", "));
  if (profile.maxMonthlyRent) parts.push(profile.maxMonthlyRent);
  if (profile.bedroomsNeeded) parts.push(profile.bedroomsNeeded);

  if (parts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-5 pb-1">
      <span className="text-xs text-muted-foreground">Searching with:</span>
      {parts.map((p) => (
        <Badge key={p} variant="secondary" className="text-xs font-normal">
          {p}
        </Badge>
      ))}
    </div>
  );
}

export function ChatSectionInner({ chatUrl, questionSuggestions }: Props) {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");
  const apiToken = process.env.NEXT_PUBLIC_CHAT_API_TOKEN;
  const [sidebarProperties, setSidebarProperties] = useState<
    PropertyDataItem[]
  >([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDataItem | null>(
    null,
  );
  const [isPropertyDetailOpen, setIsPropertyDetailOpen] = useState(false);

  const handler = useChat({
    api: chatUrl,
    headers: apiToken
      ? {
          Authorization: `Bearer ${apiToken}`,
          ...(chatId ? { "X-Chat-Id": chatId } : {}),
        }
      : chatId
        ? { "X-Chat-Id": chatId }
        : undefined,
    onFinish: (message) => {
      const { annotations } = message as {
        annotations?: UIPropertyListingAnnotation[];
      };

      if (annotations && annotations.length > 0) {
        const propertyAnnotations = annotations.filter(
          (annotation) =>
            annotation.type === UIEventsTypesEnum.PROPERTY_LISTINGS,
        ) as UIPropertyListingAnnotation[];

        if (propertyAnnotations.length > 0) {
          const latest = propertyAnnotations[propertyAnnotations.length - 1];
          const nextProperties = latest.data.properties || [];
          setSidebarProperties(nextProperties);
          setSelectedProperty(nextProperties[0] ?? null);
          setIsPropertyDetailOpen(false);
        }
      }
    },
    onError: (error) => {
      console.error("Error occurred:", error);
      toast.error(
        `An error occurred while sending your message. Please try again.`,
        {
          duration: Infinity,
          dismissible: true,
        },
      );
    },
  });

  const handleNewChatClick = () => {
    handler.stop();
    handler.setMessages([]);
    setSidebarProperties([]);
    setSelectedProperty(null);
    setIsPropertyDetailOpen(false);
  };

  const handleSelectProperty = (property: PropertyDataItem) => {
    setSelectedProperty(property);
    setIsPropertyDetailOpen(true);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-end px-4 py-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={handleNewChatClick}
        >
          <SquarePen className="h-3.5 w-3.5" />
          New Chat
        </Button>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <ChatSectionUI
          handler={handler}
          className="block h-full flex-row gap-4 p-0 md:flex"
        >
          <div className="flex h-full w-full flex-col gap-4 md:flex-row md:items-stretch">
            <div className="mx-auto flex h-full min-w-0 max-w-full flex-1 flex-col gap-4 md:max-w-[60%]">
              <CustomChatMessages />
              <div className="mb-2">
                <ProfileContextBadge />
                <ChatInput className="pb-2">
                  <ChatInput.Form>
                    <ChatInput.Field placeholder="Tell me about your perfect place" />
                    <ChatInput.Submit />
                  </ChatInput.Form>
                </ChatInput>
                <div className="px-5 text-sm text-muted-foreground">
                  Wade Me Home may make mistakes. Verify important info
                </div>
              </div>
              <QuestionSuggestions suggestions={questionSuggestions} />
            </div>

            {sidebarProperties.length > 0 && (
              <div className="mt-4 w-full border-t pt-4 pr-2 md:mt-0 md:w-[40%] md:border-l md:border-t-0 md:pl-4 md:pr-4">
                <ListingsSidebar
                  properties={sidebarProperties}
                  selectedProperty={selectedProperty}
                  onSelectProperty={handleSelectProperty}
                />
              </div>
            )}
          </div>
        </ChatSectionUI>
      </div>
      <PropertyDetailSheet
        property={selectedProperty}
        open={isPropertyDetailOpen}
        onOpenChange={setIsPropertyDetailOpen}
      />
    </div>
  );
}

export function ChatSection({ chatUrl, questionSuggestions }: Props) {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatSectionInner
        questionSuggestions={questionSuggestions}
        chatUrl={chatUrl}
      />
    </Suspense>
  );
}
