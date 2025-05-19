"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@mui/material";
// import { Input } from "@chakra-ui/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token (for now localStorage, later we will move to cookies)
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>


        <TextField
          size="small"
          id="outlined-basic"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />
        <TextField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          size="small"
          style={{ display: "block", marginBottom: "10px" }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
