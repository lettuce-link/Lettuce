/**
 * useAuth
 *
 * useRequest // memoizes request
 * useAuthRequest // with auth
 *
 * useRequestCallback
 */

import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";
import Client from "../lib/client";

export function useAuth() {
  const [auth, setAuth] = useLocalStorage("lemmy-auth-token");

  return [auth, setAuth];
}

export function useAuthRequest(requester, dependencies = []) {
  const [auth] = useAuth();

  useEffect(() => {
    const client = new Client(auth);
    requester(client);
  }, [auth, ...dependencies]);
}

export function useClient() {
  const [auth] = useAuth();

  return useMemo(() => {
    return new Client(auth);
  }, [auth]);
}
