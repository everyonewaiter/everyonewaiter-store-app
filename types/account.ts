import { AccountPermission } from "@/constants/domain";

export type AccountProfile = {
  accountId: string;
  email: string;
  permission: keyof typeof AccountPermission;
};
