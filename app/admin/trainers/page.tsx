"use client";

import EditTrainerModal from "@/app/components/EditTrainerModal";
import Sidebar from "@/app/components/sidebar";
import { useGetAllTrainersQuery, useDeleteTrainerMutation } from "@/app/services/trainersAPI";
import {
  Download,
  Edit,
  Mail,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Briefcase,
  GraduationCap,
  ChevronDown,
  Trash2 ,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getUserFromToken } from "@/app/validations/currentUser";
interface HourlyRate {
  currency: string;
  min: number;
  max: number;
}

interface Trainer {
  _id: string;
  trainerId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  status: string;
  experienceYears: number;
  education: string;
  hourlyRate: HourlyRate;
  languages?: string;
  skills: string[];
  subjects?: string;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data?: Trainer[] | { trainers?: Trainer[] };
  trainers?: Trainer[];
}

export default function TrainersPage() {
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllTrainersQuery();
  const [deleteTrainer, { isLoading: isDeleting }] = useDeleteTrainerMutation();

    const handleDelete = async (trainerId: string) => {
    if (!window.confirm("Are you sure you want to delete this trainer? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteTrainer(trainerId).unwrap();
      refetch();           // refresh the list
      // Optional: toast.success("Trainer deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      // Optional: toast.error("Failed to delete trainer");
      alert("Failed to delete trainer. Please try again.");
    }
  };


  const trainers: Trainer[] = (() => {
    if (!apiResponse) return [];
    if (Array.isArray(apiResponse)) return apiResponse;
    const response = apiResponse as any;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.trainers && Array.isArray(response.trainers))
      return response.trainers;
    return [];
  })();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [priceFilter, setPriceFilter] = useState("ALL");
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(
    null,
  );

  // Extract unique subjects + skills for filter dropdown
  const allSubjectsAndSkills = Array.from(
    new Set([
      ...(trainers.map((t) => t.subjects).filter(Boolean) as string[]),
      ...trainers.flatMap((t) => t.skills || []),
    ]),
  ).sort();

  const statusOptions = [
    "ALL",
    "ACTIVE",
    "HOLD",
    "INACTIVE",
    "BLACKLISTED",
    "PENDING APPROVAL",
  ];

  const priceOptions = [
    { value: "ALL", label: "All Prices" },
    { value: "LOW", label: "Low (< ₹10/hr)" },
    { value: "MEDIUM", label: "Medium (₹10–50/hr)" },
    { value: "HIGH", label: "High (> ₹50/hr)" },
  ];

  const filteredTrainers = trainers.filter((trainer) => {
    const searchLower = searchTerm.toLowerCase().trim();

    const fullName =
      `${trainer.firstName} ${trainer.lastName || ""}`.toLowerCase();
    const matchesSearch =
      !searchLower ||
      fullName.includes(searchLower) ||
      trainer.email.toLowerCase().includes(searchLower) ||
      trainer.trainerId.toLowerCase().includes(searchLower) ||
      (trainer.subjects?.toLowerCase().includes(searchLower) ?? false) ||
      trainer.skills.some((s) => s.toLowerCase().includes(searchLower));

    const matchesStatus =
      statusFilter === "ALL" || trainer.status === statusFilter;

    const matchesSubject =
      subjectFilter === "ALL" ||
      trainer.subjects?.toLowerCase() === subjectFilter.toLowerCase() ||
      trainer.skills.some(
        (s) => s.toLowerCase() === subjectFilter.toLowerCase(),
      );

    let matchesPrice = true;
    if (priceFilter !== "ALL") {
      const rate = trainer.hourlyRate?.max ?? 0;
      if (priceFilter === "LOW") matchesPrice = rate < 10;
      if (priceFilter === "MEDIUM") matchesPrice = rate >= 10 && rate <= 50;
      if (priceFilter === "HIGH") matchesPrice = rate > 50;
    }

    return matchesSearch && matchesStatus && matchesSubject && matchesPrice;
  });

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <Sidebar />

      <div className="drawer-content flex flex-col">
        <div className="p-4 md:p-6 lg:p-8 min-h-screen">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Trainers
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {filteredTrainers.length} trainer
                {filteredTrainers.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/trainers/new"
                className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none gap-2 shadow-sm"
              >
                <Plus size={18} /> Add Trainer
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-row sm:flex-row flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[240px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name, email, ID, subject, skill..."
                className="input input-bordered outline-none pl-6 w-full border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="dropdown dropdown-end relative">
              <label
                role="button"
                tabIndex={0}
                className="btn border-slate-200 gap-2 min-w-[160px]"
              >
                <SlidersHorizontal size={16} />
                Subjects/Skills:{" "}
                {subjectFilter === "ALL" ? "All" : subjectFilter}
                <ChevronDown size={14} />
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content z-[30] p-2 shadow-xl bg-white rounded-xl border border-slate-200 w-64 max-h-64 overflow-y-auto mt-1.5"
              >
                <li className="border-b pb-1 mb-1">
                  <button
                    onClick={() => setSubjectFilter("ALL")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    All Subjects & Skills
                  </button>
                </li>
                {allSubjectsAndSkills.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => setSubjectFilter(item)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn outline-none gap-2 min-w-[140px]"
              >
                Price:{" "}
                {priceOptions.find((o) => o.value === priceFilter)?.label ||
                  "All"}
                <ChevronDown size={14} />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-lg bg-white rounded-box w-56 z-30"
              >
                {priceOptions.map((opt) => (
                  <li key={opt.value}>
                    <button onClick={() => setPriceFilter(opt.value)}>
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn outline-none gap-2 min-w-[140px]"
              >
                Status: {statusFilter === "ALL" ? "All" : statusFilter}
                <ChevronDown size={14} />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-lg bg-white rounded-box w-56 z-30"
              >
                {statusOptions.map((s) => (
                  <li key={s}>
                    <button onClick={() => setStatusFilter(s)}>
                      {s === "ALL" ? "All Statuses" : s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
          ) : isError || trainers.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg font-medium">No trainers found</p>
              <p className="mt-2">
                Try adjusting filters or add a new trainer.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredTrainers.map((trainer) => (
                <TrainerCard
                  key={trainer._id}
                  trainer={trainer}
                  onEditClick={() => setSelectedTrainerId(trainer._id)}
                  onDeleteClick={() => handleDelete(trainer._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <EditTrainerModal
        trainerId={selectedTrainerId}
        onClose={() => setSelectedTrainerId(null)}
        onSuccess={() => {
          setSelectedTrainerId(null);
          refetch();
        }}
      />
      
    </div>
  );
}

function TrainerCard({
  trainer,
  onEditClick,
  onDeleteClick,
}: {
  trainer: Trainer;
  onEditClick: () => void;
  onDeleteClick?: () => void;
}) {
  const status = trainer.status?.toUpperCase() || "PENDING APPROVAL";
    const user = getUserFromToken();
  console.log("API Response:", user);
  const getStatusStyles = (s: string) => {
    if (s === "ACTIVE")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "HOLD") return "bg-amber-50 text-amber-700 border-amber-200";
    if (s === "INACTIVE" || s === "BLACKLISTED")
      return "bg-red-50 text-red-700 border-red-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  const hourlyDisplay =
    trainer.hourlyRate?.min === trainer.hourlyRate?.max
      ? `${trainer.hourlyRate.min} ${trainer.hourlyRate.currency}/hr`
      : `${trainer.hourlyRate.min}–${trainer.hourlyRate.max} ${trainer.hourlyRate.currency}/hr`;

  return (
    <div className="card rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-bold text-slate-800">
                {trainer.firstName} {trainer.lastName || ""}
              </h3>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(status)}`}
              >
                ● {status}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-4 text-sm text-slate-600">
              <span className="font-semibold text-blue-600 text-xs">
                #{trainer.trainerId}
              </span>
              <div className="flex items-center gap-1.5">
                <Mail size={14} className="text-slate-400" />
                <span className="truncate max-w-[180px]">{trainer.email}</span>
              </div>
            </div>

            {/* ─── Added: Title ─── */}
            {trainer.title && trainer.title.trim() && (
              <div className="mt-3 text-base font-semibold text-slate-800">
                {trainer.title}
              </div>
            )}

            {/* ─── Added: Subjects ─── */}
            {trainer.subjects && trainer.subjects.trim() && (
              <div className="mt-1.5 text-sm text-slate-600">
                <span className="font-medium">Subjects:</span>{" "}
                {trainer.subjects}
              </div>
            )}
          </div>
          {user?.adminType !== "BDE" && (
            <div className="flex gap-2">
              <button
                className="btn btn-ghost btn-sm text-slate-500 hover:text-blue-600"
                onClick={onEditClick}
              >
                <Edit size={18} />
              </button>
            </div>
          )}
          {user?.adminType === "owner" && (
            <div className="flex gap-2">
              <button
                className="btn btn-ghost btn-sm text-red-400 hover:text-red-700"
                onClick={onDeleteClick}
                // disabled={isDeleting}
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl font-bold">₹</div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Hourly Rate
              </p>
              <p className="text-base font-semibold text-slate-800">
                {hourlyDisplay}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Briefcase size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Experience
              </p>
              <p className="text-base font-semibold text-slate-800">
                {trainer.experienceYears} Years
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <GraduationCap size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Education
              </p>
              <p className="text-base font-semibold text-slate-800 truncate">
                {trainer.education}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Phone
              </p>
              <p className="text-base font-semibold text-slate-800">
                {trainer.phone}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Added: Description ─── */}
        {trainer.description && trainer.description.trim() && (
          <div className="mb-6 text-sm text-slate-600">
            <p className="font-medium mb-1.5">About the trainer:</p>
            <p className="leading-relaxed line-clamp-4">
              {trainer.description}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          {trainer.skills?.length > 0 ? (
            trainer.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-50/60 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">
              No skills listed
            </span>
          )}

          <span className="ml-auto text-xs text-slate-500 self-center">
            Added {new Date(trainer.createdAt).toLocaleDateString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
