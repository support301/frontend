"use client";
import { useState } from "react";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "@/app/services/userManager";
import { User } from "@/app/validations/user";
import {
  Trash2,
  Edit3,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";
import UserForm from "@/app/components/UserForm";
import Sidebar from "@/app/components/sidebar";

export default function EmployeeDirectory() {
  const { data, isLoading, error, refetch } = useGetAllUsersQuery();
  const users: User[] = data?.data ?? [];

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.adminType?.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "ALL" || user.status === statusFilter;

    const matchesRole =
      roleFilter === "ALL" ||
      (user.roles ?? []).some(
        (r) => r.toLowerCase() === roleFilter.toLowerCase(),
      );

    return matchesSearch && matchesStatus && matchesRole;
  });

  const openModalForUser = (user: User | null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user?"))
      return;

    try {
      await deleteUser(userId).unwrap();
      // toast.success("User deleted successfully");
      refetch(); // ← important: refresh list
    } catch (err: any) {
      console.error("Delete failed:", err);
      // toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center space-y-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-lg font-medium">Loading team directory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="card bg-base-100 shadow-xl max-w-lg w-full">
          <div className="card-body items-center text-center">
            <div className="rounded-full bg-error/10 p-4 mb-4">
              <svg
                className="w-10 h-10 text-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="card-title text-error text-xl">
              Failed to load users
            </h3>
            <p className="text-base-content/70">
              {(error as any)?.data?.message ||
                "Something went wrong. Please try again."}
            </p>
            <button className="btn btn-primary mt-6" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusOptions = ["ALL", "ACCEPTED", "PENDING", "REJECTED", "HOLD"];
  const uniqueRoles = Array.from(
    new Set(users.flatMap((u) => u.roles || [])),
  ).sort();

  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
      <Sidebar />

      <div className="drawer-content flex flex-col">
        <div className="p-5 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Employee Directory
              </h1>
              <p className="text-sm text-base-content/70 mt-1">
                {users.length} team member{users.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => openModalForUser(null)}
              className="btn btn-primary gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <UserPlus size={18} />
              Add Employee
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50"
                size={18}
              />
              <input
                type="text"
                placeholder="Search name, email, ID, admin type..."
                className="input input-bordered bg-white outline-none pl-6 w-full border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-outline-none gap-2 min-w-[140px]"
                >
                  <Filter size={16} />
                  Status: {statusFilter === "ALL" ? "All" : statusFilter}
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-56 z-30"
                >
                  {statusOptions.map((s) => (
                    <li key={s}>
                      <button
                        className={statusFilter === s ? "active" : ""}
                        onClick={() => setStatusFilter(s)}
                      >
                        {s === "ALL" ? "All Statuses" : s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-outline-none gap-2 min-w-[140px]"
                >
                  <Filter size={16} />
                  Role: {roleFilter === "ALL" ? "All" : roleFilter}
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-56 z-30"
                >
                  <li>
                    <button
                      className={roleFilter === "ALL" ? "active" : ""}
                      onClick={() => setRoleFilter("ALL")}
                    >
                      All Roles
                    </button>
                  </li>
                  {uniqueRoles.map((role) => (
                    <li key={role}>
                      <button
                        className={
                          roleFilter.toLowerCase() === role.toLowerCase()
                            ? "active"
                            : ""
                        }
                        onClick={() => setRoleFilter(role)}
                      >
                        {role}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-sm text-base-content/60 self-center whitespace-nowrap">
              {filteredUsers.length} of {users.length} shown
            </div>
          </div>

          {/* Table */}
          <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200/70">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role(s)</th>
                    <th>Admin Type</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                          <Search
                            size={64}
                            className="text-base-content/20"
                            strokeWidth={1.5}
                          />
                          <div className="text-xl font-medium text-base-content/80">
                            {search ||
                            statusFilter !== "ALL" ||
                            roleFilter !== "ALL"
                              ? "No matching employees"
                              : "No employees yet"}
                          </div>
                          <p className="text-base-content/50 max-w-md">
                            {search ||
                            statusFilter !== "ALL" ||
                            roleFilter !== "ALL"
                              ? "Try changing search term or filters"
                              : "Add your first team member to get started"}
                          </p>
                          {!search &&
                            statusFilter === "ALL" &&
                            roleFilter === "ALL" && (
                              <button
                                onClick={() => openModalForUser(null)}
                                className="btn btn-primary btn-md gap-2 mt-2"
                              >
                                <UserPlus size={18} />
                                Add Employee
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder"></div>
                            <div>
                              <div className="font-medium">
                                {user.name || "—"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{user.email || "—"}</td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            {(user.roles?.length ?? 0) > 0 ? (
                              user.roles!.map((role) => (
                                <span
                                  key={role}
                                  className="badge badge-outline badge-sm border-primary/40 text-primary"
                                >
                                  {role}
                                </span>
                              ))
                            ) : (
                              <span className="text-base-content/40">—</span>
                            )}
                          </div>
                        </td>
                        <td>
                          {(user.roles ?? []).some(
                            (r) => r.toLowerCase() === "admin",
                          ) ? (
                            user.adminType ? (
                              <span className="badge badge-sm bg-primary/10 text-primary border-primary/20">
                                {user.adminType}
                              </span>
                            ) : (
                              "—"
                            )
                          ) : (
                            <span className="text-base-content/50 text-sm">
                              Not admin
                            </span>
                          )}
                        </td>
                        <td>
                          <div
                            className={`badge badge-sm font-medium ${
                              user.status === "ACCEPTED"
                                ? "badge-success"
                                : user.status === "REJECTED"
                                  ? "badge-error"
                                  : user.status === "HOLD"
                                    ? "badge-warning"
                                    : "badge-neutral"
                            }`}
                          >
                            {user.status || "PENDING"}
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-end gap-1 overflow-visible">
                            <button
                              onClick={() => openModalForUser(user)}
                              className="btn btn-ghost btn-sm btn-square hover:bg-primary/10"
                              title="Edit user"
                              aria-label="Edit user"
                            >
                              <Edit3 size={18} />
                            </button>

                            <button
                              onClick={() => handleDelete(user._id)}
                              className="text-error btn btn-ghost btn-sm btn-square hover:bg-primary/10"
                              disabled={isDeleting}
                            >
                              <Trash2 size={16} />
                              {/* {isDeleting ? "Deleting..." : "Delete"} */}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal – fixed structure */}
        <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
          <div className="modal-box p-0 max-w-4xl w-auto shadow-2xl">
            <UserForm user={selectedUser} onClose={closeModal} />
          </div>
          <label className="modal-backdrop" onClick={closeModal}></label>
        </div>
      </div>
    </div>
  );
}
