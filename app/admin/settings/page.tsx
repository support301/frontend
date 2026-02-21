

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Palette, ArrowLeft, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/app/validations/currentUser"; 
import { useLogoutUserMutation } from "@/app/services/userauth";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [logoutUser] = useLogoutUserMutation();
  const router = useRouter();

  // We'll store the decoded user here
  const [user, setUser] = useState<ReturnType<typeof getUserFromToken>>(null);

  useEffect(() => {
    setMounted(true);

    // Get user once component is mounted (client-side only)
    const currentUser = getUserFromToken();
    setUser(currentUser);

    // Optional: if token expires while on this page → redirect
    if (!currentUser) {
      router.replace("/auth/login");
    }
  }, [router]);

  
  const handleLogout = async () => {
    try {
      const response = await logoutUser({});
      if (response.data && response.data.status === "success") {
        router.push("/auth/login");
      }
    } catch (error) {
    }
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Back button + Title row */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/admin")}
          className="btn btn-ghost btn-circle"
          aria-label="Go back to admin dashboard"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-base-content/70 text-sm mt-1">
            Manage your account preferences and appearance
          </p>
        </div>
      </div>

      {/* Profile Card – added here */}
      <section className="card bg-base-100 shadow-xl rounded-2xl p-6 border border-base-200 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">

          {/* User info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {user?.name || "User"}
            </h2>
            <p className="text-base-content/70">{user?.email || "—"}</p>
            {user?.roles && (
              <div className="badge badge-outline-none text-primary badge-sm mt-2">
                {user.roles}
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="btn btn-outline rounded-xl btn-error gap-2 mt-4 sm:mt-0"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </section>

      <div className="space-y-10">
        {/* THEME – unchanged */}
        <section className="card bg-base-100 shadow-xl rounded-2xl p-6 border border-base-200">
          <div className="flex items-center gap-3 mb-5">
            <Palette className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>

          <div className="grid grid-cols-1 rounded-xl sm:grid-cols-3 gap-4">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
              { id: "system", label: "System", icon: Monitor },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`btn btn-outline flex flex-col items-center gap-2 h-auto py-6
                  ${theme === id ? "border-primary bg-primary/10 text-primary" : ""}
                `}
              >
                <Icon className="w-8 h-8" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}