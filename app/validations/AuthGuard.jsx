
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { getUserFromToken } from "./currentUser";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      // Prevent rendering on server to avoid window-related errors
      return null;
    }
    const token = localStorage.getItem("token");

    const user = getUserFromToken(token);
    const url = window.location.pathname;
    const firstPathVariable = url.split("/").filter(Boolean)[0];

    if (firstPathVariable === "payment") {
      setAuthorized(true);
      return;
    } else if (!user?.roles?.includes(firstPathVariable)) {
      router.replace("/auth/login");
      return;
    }

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("token");
        router.replace("/auth/login");
        return;
      }

      setAuthorized(true);
    } catch (err) {
      localStorage.removeItem("token");
      router.replace("/auth/login");
    }
  }, []);

  if (!authorized) return null;

  return <>{children}</>;
}


export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;

    const now = Date.now() / 1000; // in seconds
    return decoded.exp > now;
  } catch (err) {
    return false;
  }
};
