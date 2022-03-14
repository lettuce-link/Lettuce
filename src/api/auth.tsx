import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "react-use";
import Client from "./client";

export function useAuth(): [
  string | undefined,
  Dispatch<SetStateAction<string | undefined>>
] {
  const [auth, setAuth] = useLocalStorage("lemmy-auth-token", null);

  return [auth, setAuth];
}

export function useAuthRequest(requester, dependencies = []) {
  const [auth] = useAuth();
  console.log(auth);

  useEffect(() => {
    console.log("effect");
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

export function useLogout() {
  const [_auth, setAuth] = useAuth();

  return useCallback(() => {
    setAuth(null);
  }, [setAuth]);
}
