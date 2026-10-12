import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { auth } from "../../lib/auth";

async function ProtectedProfile() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/sign-in?reason=auth_required&callbackURL=${encodeURIComponent("/profile")}`);
  }

  return <ProfileForm initialName={session.user.name || ""} email={session.user.email} />;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={(
      <main className="min-h-[70vh] bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl animate-pulse rounded-3xl border border-slate-200 bg-white p-8">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="mt-6 h-12 w-full rounded-xl bg-slate-100" />
          <div className="mt-4 h-12 w-40 rounded-xl bg-slate-200" />
        </div>
      </main>
    )}>
      <ProtectedProfile />
    </Suspense>
  );
}
