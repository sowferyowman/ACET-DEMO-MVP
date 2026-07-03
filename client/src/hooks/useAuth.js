import { useCallback, useEffect, useState } from "react";
import { getCurrentUser, initializeLocalStorage, loginUser, logoutUser } from "../services/storage";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    initializeLocalStorage();
    setUser(getCurrentUser());
  }, []);

  const login = useCallback((email, password) => {
    const authenticated = loginUser(email, password);
    setUser(authenticated);
    return authenticated;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  return { user, login, logout };
}
