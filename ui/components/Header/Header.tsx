"use client";

import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { SquarePen } from "lucide-react";

type Props = {
  onNewChat: () => void;
};

export default function Header({ onNewChat }: Props) {
  return (
    <div className="flex items-center justify-between p-2 px-4">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          <BrandLogo className="h-8 w-8 text-primary" />
        </div>

        <Button
          className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 cursor-pointer flex items-center gap-2 font-medium"
          onClick={onNewChat}
        >
          <SquarePen size={16} />
          New Chat
        </Button>
      </div>
    </div>
  );
}
