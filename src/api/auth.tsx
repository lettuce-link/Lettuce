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

export function useAuthRequest(requester, dependencies = []) {
  const [auth] = useAuth();

  console.log("auth is", auth);
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

export function useLogout() {
  const [_auth, setAuth] = useAuth();

  return useCallback(() => {
    setAuth(null);
  }, [setAuth]);
}
