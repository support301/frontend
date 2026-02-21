"use client";

import { useEffect, useRef, useState } from "react";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/app/services/userManager";
import { User, UserRole, AdminType, UserStatus } from "@/app/validations/user";
import { X, Eye, EyeOff, Check } from "lucide-react";

interface UserFormProps {
  user?: User | null;
  onClose: () => void;
}

/* ---------------- FORM STATE ---------------- */

interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  roles: UserRole[];
  adminType?: AdminType;
  status: UserStatus;
}

const defaultForm: FormData = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  roles: [UserRole.ADMIN],
  adminType: AdminType.OWNER,
  status: UserStatus.PENDING,
};

export default function UserForm({ user, onClose }: UserFormProps) {
  const isEditMode = !!user;

  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const [form, setForm] = useState<FormData>(defaultForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);

  /* ---------------- INIT FORM ---------------- */

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: "",
        phoneNumber: user.phoneNumber ?? "",
        roles: user.roles,
        adminType: user.adminType,
        status: user.status,
      });
    } else {
      setForm(defaultForm);
    }
  }, [user]);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Name is required");
    if (!form.email.trim()) return setError("Email is required");
    if (!isEditMode && !form.password.trim()) {
      return setError("Password is required");
    }

    const payload: Partial<User> = {
      name: form.name.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber || undefined,
      roles: form.roles,
      status: form.status,
    };

    // ✅ adminType ONLY when admin
    if (form.roles.includes(UserRole.ADMIN)) {
      payload.adminType = form.adminType ?? AdminType.OWNER;
    }

    if (!isEditMode || form.password.trim()) {
      payload.password = form.password.trim();
    }

    try {
      if (isEditMode && user?._id) {
        await updateUser({ id: user._id, body: payload }).unwrap();
        alert("User updated successfully");
      } else {
        await createUser(payload).unwrap();
        alert("User created successfully");
      }
      setForm(defaultForm);
      setError(null);
      setShowPassword(false);

      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to save user");
    }
  };

  const isLoading = creating || updating;

  const handleCancel = () => {
    setForm(defaultForm); // reset values
    setError(null); // clear error
    setShowPassword(false); // reset password toggle
    onClose(); // close modal
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-base-100 p-6 rounded-xl shadow-xl max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {isEditMode ? "Edit Employee" : "Add Employee"}
        </h2>
        <button onClick={handleCancel} className="btn btn-ghost btn-sm">
          <X />
        </button>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          ref={nameRef}
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="input input-bordered w-full"
          placeholder="Full Name"
        />

        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className="input input-bordered w-full"
          placeholder="Email (eg: name@example.com)"
        />

        <div className="flex gap-2">
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            className="input input-bordered flex-1"
            placeholder={isEditMode ? "New password (optional)" : "Password"}
          />
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <input
          value={form.phoneNumber}
          onChange={(e) =>
            setForm((p) => ({ ...p, phoneNumber: e.target.value }))
          }
          className="input input-bordered w-full"
          placeholder="Phone number with country code (eg: +919876543210)"
        />

        {/* Role */}
        <select
          className="select select-bordered w-full"
          value={form.roles[0]}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              roles: [e.target.value as UserRole],
              adminType:
                e.target.value === UserRole.ADMIN ? AdminType.OWNER : undefined,
            }))
          }
        >
          <option value={UserRole.ADMIN}>Admin</option>
          <option value={UserRole.INSTRUCTOR}>Instructor</option>
          <option value={UserRole.STUDENT}>Student</option>
        </select>

        {/* Admin Type */}
        {form.roles.includes(UserRole.ADMIN) && (
          <select
            className="select select-bordered w-full"
            value={form.adminType}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                adminType: e.target.value as AdminType,
              }))
            }
          >
            <option value={AdminType.OWNER}>Owner</option>
            <option value={AdminType.BDE}>BDE</option>
            <option value={AdminType.SALESMANAGER}>Sales Manager</option>
            <option value={AdminType.TRAINING_MANAGER}>Training Manager</option>
            <option value={AdminType.TUTOR_ACQUISITION}>
              Tutor Acquisition
            </option>
          </select>
        )}

        {/* Status */}
        <select
          className="select select-bordered w-full"
          value={form.status}
          onChange={(e) =>
            setForm((p) => ({ ...p, status: e.target.value as UserStatus }))
          }
        >
          <option value={UserStatus.PENDING}>Pending</option>
          <option value={UserStatus.ACCEPTED}>Accepted</option>
          <option value={UserStatus.REJECTED}>Rejected</option>
          <option value={UserStatus.HOLD}>Hold</option>
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Check /> Save
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
