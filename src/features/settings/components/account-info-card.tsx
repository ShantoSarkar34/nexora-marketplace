"use client";

import { Mail, ShieldCheck, ShieldAlert } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AuthUser } from "@/types/user";

export function AccountInfoCard({ user }: { user: AuthUser }) {
  return (
    <Card>
      <h3>Account Information</h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </span>
          <span className="text-text-primary font-medium">{user.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary flex items-center gap-2">
            {user.isVerified ? (
              <ShieldCheck className="text-status-active h-4 w-4" />
            ) : (
              <ShieldAlert className="text-status-pending h-4 w-4" />
            )}
            Verification
          </span>
          <Badge variant={user.isVerified ? "success" : "warning"}>
            {user.isVerified ? "Verified" : "Not verified"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Account type</span>
          <span className="text-text-primary font-medium">{user.role}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Member since</span>
          <span className="text-text-primary font-medium">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
}
