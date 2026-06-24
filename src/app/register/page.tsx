import type { Metadata } from "next";
import RegisterForm from "@/components/account/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account — Kobbo",
  description: "Create your Kobbo account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
