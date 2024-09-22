"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { useState } from "react";
import AccountSettings from "./AccountSettings";
import NotificationSettings from "./NotificationSettings";
import ProfileSettingsForm from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";

export const nav = [
  { title: "Profile", href: "profile" },
  { title: "Security", href: "security" },
  { title: "Notifications", href: "notifications" },
  { title: "Account Settings", href: "account" },
  { title: "Logout", href: "Logout" },
];
interface Props {
  user: User;
}
const Settings = ({ user }: Props) => {
  const [section, setSection] = useState("profile");
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          {nav.map((nav) => (
            <Button
              className={cn(
                "justify-start rounded",
                section === nav.href ? "bg-accent text-accent-foreground" : "",
              )}
              variant={"ghost"}
              onClick={() => setSection(nav.href)}
              key={nav.href}
            >
              {nav.title}
            </Button>
          ))}
        </nav>
        <div className="grid gap-6">
          {section === "profile" && <ProfileSettingsForm user={user} />}

          {section === "security" && <SecuritySettings />}

          {section === "notifications" && <NotificationSettings />}
          {section === "account" && <AccountSettings />}
        </div>
      </div>
    </main>
  );
};

export default Settings;
