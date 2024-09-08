import { currentUser } from "@/lib/userAuth";
import { redirect } from "next/navigation";
import { getUserById } from "../../(protected)/dashboard/users/_actions/user.actions";
import OnboardingForm from "./_components/OnboardingForm";
async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const dbUser = await getUserById(user.id!);
  if (dbUser?.onboarded) redirect("/dashboard");
  return (
    <div className="mx-auto mt-4 w-full max-w-3xl">
      <OnboardingForm user={dbUser!} />
    </div>
  );
}

export default OnboardingPage;
