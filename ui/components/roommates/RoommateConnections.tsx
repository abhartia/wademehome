"use client";

import { useState, useRef, useEffect } from "react";
import { useRoommate } from "@/components/providers/RoommateProvider";
import { RoommateConnection } from "@/lib/types/roommate";
import { avatarColor } from "@/lib/roommates/avatarColor";
import { Button } from "@/components/ui/button";
import { SendHorizonal, Users2, ArrowLeft } from "lucide-react";
import { SearchTogetherDialog } from "./SearchTogetherDialog";

function EmptyConnections() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Users2 className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-semibold">No connections yet</h3>
        <p className="mt-0.5 max-w-xs text-sm text-muted-foreground">
          Browse the Find Roommates tab and connect with people you&apos;d like
          to room with.
        </p>
      </div>
    </div>
  );
}

function ConnectionsList({
  connections,
  selectedId,
  onSelect,
}: {
  connections: RoommateConnection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {connections.map((conn) => {
        const isActive = conn.roommate.id === selectedId;
        const lastMsg = conn.messages[conn.messages.length - 1];
        const bgCol = avatarColor(conn.roommate.name);

        return (
          <button
            key={conn.roommate.id}
            onClick={() => onSelect(conn.roommate.id)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
              isActive ? "bg-accent" : "hover:bg-accent/50"
            } cursor-pointer`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${bgCol}`}
            >
              {conn.roommate.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{conn.roommate.name}</p>
              {lastMsg && (
                <p className="truncate text-xs text-muted-foreground">
                  {lastMsg.role === "user" ? "You: " : ""}
                  {lastMsg.content}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Conversation({
  connection,
  onSendMessage,
  onBack,
}: {
  connection: RoommateConnection;
  onSendMessage: (text: string) => void;
  onBack: () => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const bgCol = avatarColor(connection.roommate.name);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [connection.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    onSendMessage(text);
    setInputValue("");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${bgCol}`}
        >
          {connection.roommate.avatarInitials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{connection.roommate.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {connection.roommate.occupation}
          </p>
        </div>
        <SearchTogetherDialog
          connectionId={connection.roommate.id}
          roommateName={connection.roommate.name.split(" ")[0] || connection.roommate.name}
        />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-2.5">
          {connection.messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-md"
                      : "bg-muted text-foreground rounded-tl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t bg-background px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
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
    </div>
  );
}

export function RoommateConnections() {
  const { connections, addMessage } = useRoommate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (connections.length === 0) return <EmptyConnections />;

  const selectedConn = connections.find((c) => c.roommate.id === selectedId);

  const handleSendMessage = (text: string) => {
    if (!selectedId) return;
    addMessage(selectedId, {
      role: "user",
      content: text,
      time: new Date().toISOString(),
    });
  };

  return (
    <div className="flex h-full overflow-hidden rounded-lg border">
      {/* Contact list */}
      <div
        className={`w-full shrink-0 border-r md:w-72 ${
          selectedConn ? "hidden md:block" : ""
        }`}
      >
        <div className="p-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Connections ({connections.length})
          </h3>
        </div>
        <ConnectionsList
          connections={connections}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* Chat area */}
      <div className={`flex-1 ${!selectedConn ? "hidden md:flex" : "flex"}`}>
        {selectedConn ? (
          <Conversation
            connection={selectedConn}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted-foreground">
            Select a connection to message — or use &ldquo;Search together&rdquo; to start collaborating in a group.
          </div>
        )}
      </div>
    </div>
  );
}
