"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import Link from "next/link";

type DecodedToken = {
  id: number;
  username: string;
  role: string;
  userType?: string;
  applicantId?: number;
  employerId?: number;
  applicantFirstname?: string;
  applicantLastname?: string;
  // add more as needed
};

const UserLogin: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get("redirect") || "/";

  const [formData, setFormData] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      // Decode token from session if you put token in session, or fetch from cookie/localStorage if available
      // Here session.user contains id, username, role but no token by default
      // If you want JWT token, you can add it to session.user in NextAuth callbacks

      // For example, simulate token string with JWT
      // You might want to store token on login, or fetch from session.user.accessToken if set

      // This example skips token decoding because NextAuth does not expose token by default

      // Just redirect to redirectPath on auth
      router.replace(redirectPath);
    }
  }, [status, redirectPath, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const result = await signIn("credentials", {
      redirect: false,
      username: formData.username,
      password: formData.password,
      callbackUrl: redirectPath,
    });

    setIsLoading(false);

    if (result?.error) {
      setErrorMsg(result.error);
    } else if (result?.ok && result.url) {
      // Store user info in localStorage
      // If you want JWT token, you must expose it via NextAuth callbacks or fetch from your API

      // For demo, store session user info
      if (session?.user) {
        localStorage.setItem("userType", session.user.role || "");
        localStorage.setItem("userId", session.user.id?.toString() || "");
        localStorage.setItem("username", session.user.username || "");
        // add more as you want here
      }

      router.replace(result.url);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: redirectPath });
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow-sm" style={{ width: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>

          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4 w-100" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </Form>

          <hr />

          <Button variant="outline-danger" className="w-100 mb-3" onClick={handleGoogleLogin}>
            Sign in with Google
          </Button>

          <div className="text-center mt-3">
            <Link href="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </Link>
          </div>
          <div className="text-center mt-2">
            <span>Not registered yet? </span>
            <Link href="/register" className="text-decoration-none">
              Create an account
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserLogin;
