import ProfileForms from "@/components/settings/profile-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/settings/_layout/")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <ProfileForms />
    </div>
  );
}
