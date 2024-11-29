"use client";

import Image from "next/image";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

import { store, StoreActions } from "@/lib/store";
import { getUserData, signInAction } from "@/lib/actions/users";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { authenticationSchema } from "@/lib/db/schema";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signInAction, {
    success: false,
    error: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (!state.success && state.error)
      toast.error("Error", { duration: 10000, description: state.error });
    if (state.success) {
      toast.success("Signed in", { duration: 2000 });
      if (!store.getState().user) {
        getUserData().then((res): void => {
          const storeActions = store.getActions() as StoreActions;

          res?.user && storeActions.setUser(res.user);
          res?.auth && storeActions.setAuth(res.auth);
          res?.session && storeActions.setSession(res.session);
        });
      }
      router.push("/home");
    }
  }, [state]);

  const form = useForm<z.infer<typeof authenticationSchema>>();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center">
            <Image
              src="/static/images/icons/lophura-text-dark.svg"
              alt="Lophura"
              width={100}
              height={26}
              className="mb-2 block dark:hidden"
            />
            <Image
              src="/static/images/icons/lophura-text-light.svg"
              alt="Lophura"
              width={100}
              height={26}
              className="mb-2 hidden dark:block"
            />
          </div>
          <CardTitle className="flex justify-center">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="flex flex-col gap-2" action={formAction}>
              <FormField
                control={form.control}
                defaultValue=""
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@example.com"
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                defaultValue=""
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="somepassword"
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton />
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      Sign{pending ? "ing" : ""} in
    </Button>
  );
};
