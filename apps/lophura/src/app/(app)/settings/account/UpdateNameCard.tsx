"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

import { AccountCard, AccountCardFooter, AccountCardBody } from "./AccountCard";
import { updateUser, getUserData } from "@/lib/actions/users";
import { store, StoreActions } from "@/lib/store";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UpdateNameCard({ name }: { name: string }) {
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
      toast.success("Username has been updated.");
    }
    if (!state.success && state.error)
      toast.error("Error", { description: state.error });
  }, [state]);

  return (
    <AccountCard
      params={{
        header: "Your Name",
        description:
          "Please enter your full name, or a display name you are comfortable with.",
      }}
    >
      <form action={formAction}>
        <AccountCardBody>
          <Input defaultValue={name ?? ""} name="name" />
        </AccountCardBody>
        <AccountCardFooter description="64 characters maximum">
          <Submit />
        </AccountCardFooter>
      </form>
    </AccountCard>
  );
}

const Submit = () => {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>Update Name</Button>;
};
