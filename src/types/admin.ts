import type { StatusCounts } from "@/types/dashboard";
import type { ContractStatus, JobStatus } from "@/types/enums";
import type { AuthProvider, UserRole } from "@/types/user";

export interface AdminStats {
  users: {
    total: number;
    byRole: Partial<Record<UserRole, number>>;
    suspended: number;
  };
  jobs: StatusCounts<JobStatus>;
  contracts: StatusCounts<ContractStatus>;
  disputes: { open: number };
  revenue: {
    totalRevenue: number;
    platformFees: number;
    inEscrow: number;
    refunded: number;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  provider: AuthProvider;
  imageUrl?: string | null;
  isSuspended: boolean;
  suspensionReason?: string | null;
  // Deleted accounts stay on record, anonymized as "Deleted user".
  isDeleted: boolean;
  createdAt: string;
}

export interface AdminUserListParams {
  role?: UserRole;
  search?: string;
  isVerified?: boolean;
  page?: number;
  limit?: number;
}
