// app/components/EditTrainerModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import {
  useGetTrainerByIdQuery,
  useUpdateTrainerMutation,
} from "@/app/services/trainersAPI"; // ← adjust path if needed

interface EditTrainerModalProps {
  trainerId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditTrainerModal({
  trainerId,
  onClose,
  onSuccess,
}: EditTrainerModalProps) {
  const isOpen = trainerId !== null;

  const { data: trainer, isLoading: isFetching } = useGetTrainerByIdQuery(
    trainerId!,
    { skip: !isOpen },
  );

  const [updateTrainer, { isLoading: isUpdating }] = useUpdateTrainerMutation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "PENDING APPROVAL",
    experienceYears: 0,
    education: "",
    hourlyRate: { currency: "INR", min: 0, max: 0 },
    skills: [] as string[],
  });

  useEffect(() => {
    if (trainer && typeof trainer === "object") {
      setForm({
        firstName: (trainer as any).firstName || "",
        lastName: (trainer as any).lastName || "",
        email: (trainer as any).email || "",
        phone: (trainer as any).phone || "",
        status: (trainer as any).status || "PENDING APPROVAL",
        experienceYears: (trainer as any).experienceYears || 0,
        education: (trainer as any).education || "",
        hourlyRate: (trainer as any).hourlyRate || { currency: "INR", min: 0, max: 0 },
        skills: (trainer as any).skills || [],
      });
    }
  }, [trainer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerId) return;

    try {
      await updateTrainer({
        id: trainerId,
        ...form,
        status: form.status as any,
        hourlyRate: {
          ...form.hourlyRate,
          min: Number(form.hourlyRate.min),
          max: Number(form.hourlyRate.max),
        },
        experienceYears: Number(form.experienceYears),
      }).unwrap();

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update trainer. Check console.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* header */}
          <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-slate-800">
              Edit Trainer
            </h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X size={20} />
            </button>
          </div>

          {isFetching ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Two-column layout for larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="label">
                    <span className="label-text font-medium">First Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Last Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered w-full"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Phone</span>
                  </label>
                  <input
                    type="tel"
                    className="input input-bordered w-full"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Experience (years)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="input input-bordered w-full"
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Education</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={form.education}
                    onChange={(e) => setForm({ ...form, education: e.target.value })}
                  />
                </div>

              </div>

              {/* Hourly Rate */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Currency</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={form.hourlyRate.currency}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hourlyRate: { ...form.hourlyRate, currency: e.target.value },
                      })
                    }
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Min Rate</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="input input-bordered w-full"
                    value={form.hourlyRate.min}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hourlyRate: { ...form.hourlyRate, min: Number(e.target.value) },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Max Rate</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="input input-bordered w-full"
                    value={form.hourlyRate.max}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hourlyRate: { ...form.hourlyRate, max: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Status</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="PENDING APPROVAL">Pending Approval</option>
                  <option value="ACTIVE">Active</option>
                  <option value="HOLD">Hold</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="BLACKLISTED">Blacklisted</option>
                </select>
              </div>

              {/* Skills – simple textarea for now */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Skills (comma separated)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  value={form.skills.join(", ")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="React, Node.js, Python, Communication..."
                />
              </div>

              {/* Footer buttons */}
              <div className="sticky bottom-0 bg-white pt-5 border-t flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onClose}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary gap-2 min-w-[140px]"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}