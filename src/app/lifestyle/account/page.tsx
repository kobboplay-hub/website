import AccountDashboard from "@/components/account/AccountDashboard";
import { requireAuthRedirect } from "@/lib/auth/guard";

export default async function LifestyleAccountPage() {
  await requireAuthRedirect("/lifestyle/account");
  return <AccountDashboard />;
}
