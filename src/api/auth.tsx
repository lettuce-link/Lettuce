import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "react-use";
import Client from "./client";
import Router from "next/router";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [storage, setStorage] = useLocalStorage("lemmy-auth-token", null);
  const [value, setValue] = useState(storage);

  function setAuth(value) {
    setStorage(value);
    setValue(value);
  }

  return (
    <AuthContext.Provider value={[value, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): [
  string | undefined,
  Dispatch<SetStateAction<string | undefined>>
] {
  const [auth, setAuth] = useContext(AuthContext);

  return [auth, setAuth];
}

export function useIsLoggedIn() {
  const [auth] = useAuth();
  return !!auth;
}

/**
 * Calls the provided function with a `client` object whenever authentication status changes, or when one of the dependencies changes.
 * The provided function may return a "cleanup" callback similarly to how useEffect works.
 * @param requester
 * @param dependencies
 */
export function useAuthRequest(requester, dependencies = []) {
  const [auth] = useAuth();

  useEffect(() => {
    const client = new Client(auth);
    return requester(client);
  }, [auth, ...dependencies]);
}

export function redirectToAuthentication() {
  // todo: would be nice to set the return url
  Router.push("/enter");
}

export function useAuthGuard(shouldBeLoggedIn = true) {
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (shouldBeLoggedIn && !isLoggedIn) {
      redirectToAuthentication();
    }

    if (!shouldBeLoggedIn && isLoggedIn) {
      Router.replace("/");
    }
  }, []);
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
