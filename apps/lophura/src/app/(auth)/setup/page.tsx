"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

import { store, StoreActions } from "@/lib/store";
import { getUserData, signUpAction } from "@/lib/actions/users";

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
import { authenticationRegisterSchema } from "@/lib/db/schema";

export default function SignUpPage() {
  const [state, formAction] = useActionState(signUpAction, {
    success: false,
    error: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (!state.success && state.error)
      toast.error("Error", { duration: 2000, description: state.error });
    if (state.success) {
      toast.success("Signed up", { duration: 2000 });
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

  const form = useForm<z.infer<typeof authenticationRegisterSchema>>();

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
          <CardTitle className="flex justify-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            It looks like it&apos;s your first time installing Lophura.
            <br />
            Please enter your credentials below.
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
                        type="email"
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
                        autoComplete="new-password"
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
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="somepassword"
                        type="password"
                        autoComplete="new-password"
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

  //return (
  //  <main className="mx-auto my-4 max-w-lg bg-popover p-10">
  //    <h1 className="text-center text-2xl font-bold">Create an account</h1>
  //    <form action={formAction}>
  //      <Label htmlFor="email" className="text-muted-foreground">
  //        Email
  //      </Label>
  //      <Input name="email" type="email" id="email" required />
  //      <br />
  //      <Label htmlFor="password" className="text-muted-foreground">
  //        Password
  //      </Label>
  //      <Input type="password" name="password" id="password" required />
  //      <br />
  //      <SubmitButton />
  //    </form>
  //    <div className="mt-4 text-center text-sm text-muted-foreground">
  //      Already have an account?{" "}
  //      <Link href="/" className="text-secondary-foreground underline">
  //        Sign in
  //      </Link>
  //    </div>
  //  </main>
  //);
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      Sign{pending ? "ing" : ""} up
    </Button>
  );
};
