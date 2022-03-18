import { VerifyEmailPage } from "components/verify_email";
import { useRouter } from "next/router";

/**
 * Email validation page
 * Important: this must be at /validate_email/[token], because that's where the lemmy backend sends users to validate their email. (This link will be received in an email)
 */
export default function VerifyEmailPageWrapper() {
  const router = useRouter();

  const { token } = router.query;

  return <VerifyEmailPage token={token} />;
}
