"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { loginUser } from "@/services/authServices";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email, password);

      // Save token
      localStorage.setItem("token", data.token);

      // Save user (optional but useful)
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to access your ForgeMind workspace."
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLinkText="Create one"
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <AuthInput
          label="Email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthButton type="submit" isLoading={loading}>
          Sign In
        </AuthButton>
      </form>
    </AuthCard>
  );
}