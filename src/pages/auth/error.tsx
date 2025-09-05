// pages/auth/error.tsx
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Container, Alert, Button } from 'react-bootstrap';

const errorMessages: Record<string, string> = {
  CredentialsSignin: "Invalid username or password.",
  OAuthAccountNotLinked: "This account is not linked. Please use the same sign-in method.",
  Default: "An unexpected error occurred. Please try again.",
};

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  // Pick a friendly message for known errors
  const message = typeof error === 'string' ? (errorMessages[error] || errorMessages.Default) : errorMessages.Default;

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <Alert variant="danger">
        <h4>Login Error</h4>
        <p>{message}</p>
        <div className="d-flex justify-content-between">
          <Button variant="primary" onClick={() => router.push('/auth/login')}>
            Back to Login
          </Button>
          <Link href="/" passHref>
            <Button variant="secondary">Home</Button>
          </Link>
        </div>
      </Alert>
    </Container>
  );
}
