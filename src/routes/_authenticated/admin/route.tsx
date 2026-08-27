import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { verifyAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const { isAdmin } = await verifyAdmin();
    if (!isAdmin) {
      toast.error("You don't have permission to access this page.");
      throw redirect({ to: "/" });
    }
    return { isAdmin: true };
  },
  component: () => <Outlet />,
});
