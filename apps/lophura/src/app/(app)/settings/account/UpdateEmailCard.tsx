"use client";

import { useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";

import { AccountCard, AccountCardFooter, AccountCardBody } from "./AccountCard";
import { updateUser, getUserData } from "@/lib/actions/users";
import { store, StoreActions } from "@/lib/store";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UpdateEmailCard({ email }: { email: string }) {
  const [state, formAction] = useActionState(updateUser, {
    error: "",
    success: false,
  });

  useEffect(() => {
    if (state.success == true) {
      getUserData().then((res): void => {
        const storeActions = store.getActions() as StoreActions;

        res?.user && storeActions.setUser(res.user);
        res?.auth && storeActions.setAuth(res.auth);
        res?.session && storeActions.setSession(res.session);
      });
      toast.success("Email has been updated.");
    }
    if (!state.success && state.error)
      toast.error("Error", { description: state.error });
  }, [state]);

  return (
    <AccountCard
      params={{
        header: "Your Email",
        description:
          "Please enter the email address you want to use with your account.",
      }}
    >
      <form action={formAction}>
        <AccountCardBody>
          <Input defaultValue={email ?? ""} name="email" />
        </AccountCardBody>
        <AccountCardFooter description="Please enter the email address you want to use with your account.">
          <Submit />
        </AccountCardFooter>
      </form>
    </AccountCard>
  );
}

const Submit = () => {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>Update Email</Button>;
};
