import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface NavNotificationsProps {
  count?: number;
}

export function NavNotifications({ count = 0 }: NavNotificationsProps) {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="w-4 h-4" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Button>
  );
}