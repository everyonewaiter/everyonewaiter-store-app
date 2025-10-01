import { AccountPermission } from "@/constants";

export type AccountProfile = {
  accountId: string;
  email: string;
  permission: keyof typeof AccountPermission;
};
