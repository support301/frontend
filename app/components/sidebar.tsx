
"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Users,
  User,
  ChartColumn,
  Settings,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobile = () => setIsMobileOpen((prev) => !prev);

  const closeMobileMenu = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle Button - Only visible on mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <label
          htmlFor="my-drawer"
          onClick={toggleMobile}
          className="btn btn-ghost btn-circle hover:bg-base-300/80 backdrop-blur-sm"
        >
          {isMobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </label>
      </div>

      {/* Mobile Drawer Overlay */}
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isMobileOpen}
        onChange={() => { }}
      />

      <div className="drawer-side z-50 hide-scrollbar">
        <label
          htmlFor="my-drawer"
          onClick={closeMobileMenu}
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul
          className={`
            menu min-h-full bg-base-200/95 backdrop-blur-md
            text-base-content overflow-y-auto border-r border-base-300/30 
            shadow-2xl flex flex-col hide-scrollbar
            hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all duration-300
          `}
          style={{ "--p": "#007dc5", "--pf": "#71bf43" } as React.CSSProperties}
        >
          {/* Mobile Header with Close Button */}
          {isMobile && (
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/10">
                    
                  </div>
                </Link>
              </div>
              <button
                onClick={closeMobileMenu}
                className="btn btn-ghost btn-circle hover:bg-base-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Collapse Button - Always visible on desktop, hidden on mobile */}
          {!isMobile && (
            <div className={`${collapsed ? "mt-4" : "mb-4"} flex justify-center`}>
              <button
                onClick={toggleCollapse}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="
                  btn 
                  btn-circle 
                  w-10 
                  h-10 
                  min-h-0 
                  p-0 
                  hover:bg-base-300 
                  transition-all
                  flex items-center justify-center"
              >
                {collapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>
            </div>
          )}


          {/* Content - Only shown when NOT collapsed on desktop, always shown on mobile */}
          {(isMobile || !collapsed) && (
            <>
              {/* Logo & Title - Only on desktop when not collapsed */}
              {!isMobile && !collapsed && (
                <div className="hidden lg:flex items-center gap-4 px-2 mb-8">
                  <Link href="/" className="flex items-center justify-center w-full group">
                    <div className="flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                    <div className="text-2xl text-primary font-bold">ProAce Academy</div>
                    
                    </div>
                  </Link>
                </div>
              )}

              {/* Menu Items - Only show when not collapsed */}
              {!collapsed && (
                <>

                    <details>
                      <summary
                        onClick={isMobile ? closeMobileMenu : undefined}
                        className="hover:bg-blue-300/70 rounded-xl px-4 py-3 transition-all duration-300 hover:shadow-md flex items-center gap-3 font-semibold"
                      >
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        <Link href="/admin/trainers" className="flex-1">Trainers</Link>
                        {/* <span>Trainers</span> */}
                      </summary>
                    </details>
           

      
                    <details>
                      <summary
                        onClick={isMobile ? closeMobileMenu : undefined}
                        className="hover:bg-blue-300/70 rounded-xl px-4 py-3 transition-all duration-300 hover:shadow-md flex items-center gap-3 font-semibold"
                      >
                        <Users className="h-6 w-6 text-primary" />
                        <Link href="/admin/employees" className="flex-1">Employees</Link>
                      </summary>
                    </details>
      


                    {/* <details>
                      <summary
                        onClick={isMobile ? closeMobileMenu : undefined}
                        className="hover:bg-blue-300/70 rounded-xl px-4 py-3 transition-all duration-300 hover:shadow-md flex items-center gap-3 font-semibold"
                      >
                        <ChartColumn className="h-6 w-6 text-primary" />
                        <Link href="/admin/analytics" className="flex-1">Analytics</Link>
                      </summary>
                    </details> */}
      

                  

                  <div className="divider my-8 opacity-50"></div>

                  <li className="mt-auto">
                    <div className="flex items-center justify-between px-4 py-3">
                      <Link
                        href="/admin/settings"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 -ml-4 flex-1 transition-all duration-300 hover:shadow-md font-semibold"
                      >
                        <Settings className="h-6 w-6 text-primary" />
                        <span>Settings</span>
                      </Link>
                      <ThemeToggle />
                    </div>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </>
  );
}


