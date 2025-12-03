'use client'
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { redirect } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function RegisterForm() {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const senha = formData.get("senha") as string;

    authClient.signUp.email({
      name: name,
      email: email,
      password: senha
    },
    {
      onSuccess: () => redirect("/dashboard"),
      onRequest: () => setLoading(true),
      onResponse: () => setLoading(false),
      onError: (ctx) => setError(ctx.error.message)
    })
  }

  return (
    <form onSubmit={handleRegister}>
      <Input name="name" placeholder="Nome" />
      <Input name="email" placeholder="Email" type="email" />
      <Input name="senha" placeholder="Senha" type="password" />
      <Button disabled={loading}>
        {loading ? <Spinner /> : "Registrar"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
