// app/page.tsx
import Link from 'next/link';
import Sidebar from "@/app/components/sidebar";
import { Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="drawer lg:drawer-open">
      <Sidebar />

      <div className="drawer-content flex flex-col min-h-screen">
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-base-content/70 mb-8">
            Manage your training platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick access card to Trainers */}
            <Link href="/admin/trainers" className="card shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="card-title text-xl">Trainers</h2>
                    <p className="text-sm opacity-70">Manage trainer profiles, skills, rates</p>
                  </div>
                  <ArrowRight size={24} className="text-primary" />
                </div>
                <div className="mt-4">
                  <div className="badge badge-primary gap-2">
                    <Users size={16} /> Manage Trainers
                  </div>
                </div>
              </div>
            </Link>

            {/* You can add more cards: Users, Courses, Payments, etc. */}
          </div>
        </main>
      </div>
    </div>
  );
}