"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { registerUser } from "@/services/authServices";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(email, password);

      alert("Registration successful!");

      router.push("/login");
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Start your ForgeMind AI workspace."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Sign In"
    >
      <form
        onSubmit={handleSignup}
        className="space-y-5"
      >
        <AuthInput
          label="Email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="Minimum 6 characters"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <AuthButton
          type="submit"
          isLoading={loading}
        >
          Create Account
        </AuthButton>
      </form>
    </AuthCard>
  );
}