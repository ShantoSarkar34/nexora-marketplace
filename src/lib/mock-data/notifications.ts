import type { AppNotification } from "@/types/notification";

// Track B: replace with GET /notifications
export const mockNotifications: AppNotification[] = [
  {
    id: "n-1",
    type: "SHORTLISTED",
    message: "You were shortlisted for \"Node.js Backend for Marketplace Platform\"",
    isRead: false,
    createdAt: "2026-08-22T10:00:00Z",
    link: "/freelancer/applications/app-2",
  },
  {
    id: "n-2",
    type: "PAYMENT_SUCCESS",
    message: "Payment of $450 received for \"Landing Page Design + Build\"",
    isRead: false,
    createdAt: "2026-08-21T15:30:00Z",
    link: "/freelancer/contracts/contract-1",
  },
  {
    id: "n-3",
    type: "WORK_SUBMITTED",
    message: "Your work for \"Portfolio Site Refresh\" was submitted for review",
    isRead: true,
    createdAt: "2026-08-20T09:15:00Z",
    link: "/freelancer/contracts/contract-2",
  },
  {
    id: "n-4",
    type: "NEW_REVIEW",
    message: "Alex Rivera left you a 5-star review",
    isRead: true,
    createdAt: "2026-07-31T12:00:00Z",
  },
];