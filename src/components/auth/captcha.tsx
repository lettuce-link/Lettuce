import { useEffect, useState } from "react";
import { useClient } from "../../api/auth";

export function useCaptcha() {
  const client = useClient();
  const [captcha, setCaptcha] = useState(null);
  const [needsCaptcha, setNeedsCaptcha] = useState(false);

  function refreshCaptcha() {
    setCaptcha(null);
    client.getCaptcha().then((response) => {
      setCaptcha(response);
      setNeedsCaptcha(response.ok !== null);
    });
  }

  useEffect(refreshCaptcha, []);

  // todo
  function Captcha() {
    return <>{JSON.stringify(captcha)}</>;
  }

  return { needsCaptcha, Captcha };
}
