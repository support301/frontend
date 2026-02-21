"use client";

import { isTokenValid } from "@/app/validations/AuthGuard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserFromToken } from "@/app/validations/currentUser";

export default function Home() {
  const router = useRouter();
  const user = getUserFromToken();
  const userRole = Array.isArray(user?.roles) ? user.roles[0] : user?.roles;

  useEffect(() => {
    const token = localStorage.getItem("token"); // or cookies if you're using them

    if (token && isTokenValid(token) && userRole) {
      switch (userRole) {
        case "admin":
          router.replace("/admin/trainers");
          break;
        case "student":
          router.replace("/student/dashboard");
          break;
        case "instructor":
          router.replace("/instructor/dashboard");
          break;
        default:
          router.replace("/auth/login"); // fallback
      }
    } else {
      router.replace("/auth/login");
    }
  }, [router, userRole]);
  return (
    <>Loading...
    </>
  );
}
