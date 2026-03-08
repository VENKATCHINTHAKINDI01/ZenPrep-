"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const authSchema = (type: "sign-in" | "sign-up") =>
  z.object({
    name: type === "sign-up" ? z.string().min(2) : z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

type AuthFormValues = z.infer<ReturnType<typeof authSchema>>;

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isSignIn = type === "sign-in";

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema(type)),
  });

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);
    try {
      if (!isSignIn) {
        const userCredential = await createUserWithEmailAndPassword(
          auth, data.email, data.password
        );
        const result = await signUp({
          uid: userCredential.user.uid,
          name: data.name!,
          email: data.email,
          password: data.password,
        });
        if (result.success) {
          toast.success("Account created successfully!");
          router.push("/");
        } else {
          toast.error(result.message || "Sign up failed");
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth, data.email, data.password
        );
        const result = await signIn({
          email: data.email,
          idToken: await userCredential.user.getIdToken(),
        });
        if (result.success) {
          toast.success("Signed in successfully!");
          router.push("/");
        } else {
          toast.error(result.message || "Sign in failed");
        }
      }
    } catch (error: any) {
      const messages: Record<string, string> = {
        "auth/email-already-in-use": "Email already in use",
        "auth/user-not-found": "No account found with this email",
        "auth/wrong-password": "Incorrect password",
        "auth/invalid-credential": "Invalid email or password",
        "auth/too-many-requests": "Too many attempts. Try again later",
      };
      toast.error(messages[error.code] || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.png" alt="ZenPrep" width={38} height={32} />
          <h2 className="text-primary-100">ZenPrep</h2>
        </div>
        <h3 className="text-center">
          {isSignIn ? "Welcome" : "Create your account"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {!isSignIn && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your full name" {...register("name")} />
              {errors.name && <p className="text-destructive-100 text-xs">{errors.name.message}</p>}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" {...register("email")} />
            {errors.email && <p className="text-destructive-100 text-xs">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && <p className="text-destructive-100 text-xs">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isSignIn ? "Signing in..." : "Creating account..."}
              </span>
            ) : (
              isSignIn ? "Sign In" : "Create Account"
            )}
          </Button>
        </form>

        <p className="text-center text-light-400 text-sm">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="text-primary-200 font-semibold hover:underline">
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
