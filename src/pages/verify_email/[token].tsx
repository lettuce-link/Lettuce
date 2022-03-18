import { VerifyEmailPage } from "components/verify_email";
import { useRouter } from "next/router";

export default function VerifyEmailPageWrapper() {
  const router = useRouter();

  const { token } = router.query;

  return <VerifyEmailPage token={token} />;
}
