import type { EntityType, NotificationType } from "@/types/enums";

export type { EntityType, NotificationType };

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  entityType?: EntityType | null;
  entityId?: string | null;
  meta?: Record<string, string> | null;
  isRead: boolean;
  createdAt: string;
}
