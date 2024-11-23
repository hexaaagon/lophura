"use client";

import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signInAction } from "@/lib/actions/users";

import { Label } from "@/components/ui/label";
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

import { useForm } from "react-hook-form";
import { z } from "zod";
import { authenticationSchema } from "@/lib/db/schema";

export default function SignInPage() {
  const [state, formAction] = useActionState(signInAction, {
    error: "",
  });

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
              height={100}
              className="mb-2 block dark:hidden"
            />
            <Image
              src="/static/images/icons/lophura-text-light.svg"
              alt="Lophura"
              width={100}
              height={100}
              className="mb-2 hidden dark:block"
            />
          </div>
          <CardTitle className="flex justify-center">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
            {state.error && <p className="text-destructive">{state.error}</p>}
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
                      <Input placeholder="admin@example.com" {...field} />
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
