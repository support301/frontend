"use client";
import Sidebar from "@/app/components/sidebar";
import { useCreateTrainerMutation } from "@/app/services/trainersAPI";
import {
  ArrowLeft,
  Check,
  Loader2,
  Plus,
  X,
  User,
  Briefcase,
  GraduationCap,
  DollarSign,
  Globe,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const STATUS_OPTIONS = [
  "ACTIVE",
  "HOLD",
  "INACTIVE",
  "BLACKLISTED",
  "PENDING APPROVAL",
] as const;
const CURRENCY_OPTIONS = ["INR", "USD", "EUR", "GBP"] as const;
const SKILL_OPTIONS = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "Java",
  "C++",
  "AWS",
  "Docker",
  "Machine Learning",
  "Data Science",
];

export default function AddTrainerPage() {
  const router = useRouter();
  const [createTrainer, { isLoading }] = useCreateTrainerMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "PENDING APPROVAL" as const,
    experienceYears: 0,
    education: "",
    hourlyRate: { currency: "INR", min: 0, max: 0 },
    languages: "",
    skills: [] as string[],
    subjects: "",
    title: "",
    description: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [customSkill, setCustomSkill] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("hourlyRate.")) {
      const field = name.split(".")[1] as keyof typeof formData.hourlyRate;
      setFormData((prev) => ({
        ...prev,
        hourlyRate: {
          ...prev.hourlyRate,
          [field]: field === "currency" ? value : parseFloat(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "experienceYears" ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleAddSkill = (skill: string) => {
    if (!formData.skills.includes(skill) && skill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
    }
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()],
      }));
      setCustomSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.firstName.trim()) {
        toast.error("First name is required");
        return;
      }
      if (!formData.email.trim()) {
        toast.error("Email is required");
        return;
      }
      if (formData.hourlyRate.min > formData.hourlyRate.max) {
        toast.error("Min rate cannot exceed max rate");
        return;
      }

      await createTrainer({
        ...formData,
        lastName: formData.lastName || "",
        languages: formData.languages || "",
        skills: formData.skills.length > 0 ? formData.skills : [], // ✅ FIXED
        subjects: formData.subjects || "",
        title: formData.title || "",
        description: formData.description || "",
      }).unwrap();





      toast.success("Trainer added successfully!");
      router.push("/admin/trainers");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add trainer.");
    }
  };

  return (
    <div className="drawer lg:drawer-open bg-base-300">
      <Sidebar />
      <div className="drawer-content flex flex-col min-h-screen">
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <Link
                href="/admin/trainers"
                className="group flex items-center gap-2 text-primary text-sm font-medium mb-2 hover:underline"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform group-hover:-translate-x-1"
                />
                Back to Trainer Directory
              </Link>
              <h1 className="text-4xl font-black tracking-tight">
                Add New <span className="text-primary">Trainer</span>
              </h1>
            </div>
          </div>

          <form id="trainer-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Personal Details */}
            <div className="card bg-base-100 border border-base-content/5 shadow-sm hover:border-primary/20 transition-colors rounded-3xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-widest">
                  <User size={16} /> Basic Identity
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="form-control">
                    <label className="label-text mb-2 block font-medium">
                      First Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input input-bordered rounded-2xl outline-none focus:input-primary transition-all"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label-text mb-2 block font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input input-bordered rounded-2xl outline-none focus:input-primary"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label-text mb-2 block font-medium">
                      Professional Email
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input input-bordered rounded-2xl outline-none focus:input-primary"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label-text mb-2 block font-medium">
                      Phone Number
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input input-bordered rounded-2xl outline-none focus:input-primary"
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Professional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-base-100 border border-base-content/5 shadow-sm md:col-span-2 rounded-3xl">
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-4 text-secondary font-bold uppercase text-xs tracking-widest">
                    <Briefcase size={16} /> Expertise & Background
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="form-control">
                      <label className="label-text mb-2 block font-medium">
                        Current Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="select select-bordered rounded-2xl outline-none focus:select-secondary"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label-text mb-2 block font-medium">
                        Experience (Years)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        className="input input-bordered rounded-2xl outline-none focus:input-secondary"
                      />
                    </div>
                    <div className="form-control md:col-span-2">
                      <label className="label-text mb-2 block font-medium">
                        Education Background
                      </label>
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="input input-bordered rounded-2xl outline-none focus:input-secondary"
                        placeholder="e.g. Masters in Computer Science"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rate Card */}
              <div className="card bg-base-100 shadow-xl rounded-3xl">
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-4 font-bold uppercase text-xs tracking-widest opacity-70">
                    <DollarSign size={16} /> Rate Card
                  </div>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label-text mb-2 block font-medium">
                        Currency
                      </label>
                      <select
                        name="hourlyRate.currency"
                        value={formData.hourlyRate.currency}
                        onChange={handleChange}
                        className="select bg-base-100 select-bordered outline-none rounded-2xl w-full focus:input-secondary"
                      >
                        {CURRENCY_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="form-control">
                        <label className="label-text mb-2 block font-medium mb-2">
                          Min /hr
                        </label>
                        <input
                          type="number"
                          name="hourlyRate.min"
                          value={formData.hourlyRate.min}
                          onChange={handleChange}
                          className="input input-bordered outline-none rounded-2xl bg-base-100 w-full focus:input-secondary"
                          placeholder="0"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label-text mb-2 block font-medium">
                          Max /hr
                        </label>
                        <input
                          type="number"
                          name="hourlyRate.max"
                          value={formData.hourlyRate.max}
                          onChange={handleChange}
                          className="input input-bordered outline-none rounded-2xl bg-base-100 w-full focus:input-secondary"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Skills & Content */}
            <div className="card bg-base-100 border border-base-content/5 shadow-sm rounded-3xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4 text-accent font-bold uppercase text-xs tracking-widest">
                  <Award size={16} /> Skills & Specialties
                </div>

                {/* Active Skills Pills */}
                <div className="flex flex-wrap gap-2 mb-6 min-h-[40px] p-3 rounded-xl bg-base-200/50 border border-dashed border-base-content/10">
                  {formData.skills.length === 0 && (
                    <span className="text-sm opacity-40 italic">
                      No skills selected yet...
                    </span>
                  )}
                  {formData.skills.map((skill) => (
                    <div
                      key={skill}
                      className="badge badge-accent badge-lg py-4 px-3 gap-2 animate-in zoom-in-90 duration-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:bg-accent-focus rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <label className="label-text mb-3 block font-medium italic opacity-70">
                      Quick Select Skills
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SKILL_OPTIONS.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleAddSkill(skill)}
                          disabled={formData.skills.includes(skill)}
                          className={`btn btn-xs rounded-full transition-all ${formData.skills.includes(skill) ? "btn-disabled opacity-30" : "btn-outline btn-accent hover:scale-105"}`}
                        >
                          {skill}{" "}
                          {formData.skills.includes(skill) ? (
                            <Check size={12} />
                          ) : (
                            <Plus size={12} />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="join gap-2 w-full mt-4">
                      <input
                        type="text"
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        className="input input-sm input-bordered join-item rounded-2xl w-full outline-none"
                        placeholder="Other skill..."
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSkill}
                        className="btn btn-sm btn-accent p-2 join-item rounded-2xl"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label-text mb-2 block font-medium">
                        Languages
                      </label>
                      <div className="relative">
                        <Globe
                          className="absolute left-3 top-3 opacity-30"
                          size={18}
                        />
                        <input
                          type="text"
                          name="languages"
                          value={formData.languages}
                          onChange={handleChange}
                          className="input input-bordered rounded-2xl w-full outline-none"
                          placeholder="English, French..."
                        />
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label-text mb-2 block font-medium">
                        Subjects
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="subjects"
                        value={formData.subjects}
                        onChange={handleChange}
                        className="input input-bordered rounded-2xl outline-none"
                        placeholder="Algebra, Quantum Physics..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-content/5 shadow-sm rounded-3xl">
              {" "}
              <div className="card-body">
                {" "}
                <div className="form-control">
                  {" "}
                  <label className="label-text mb-2 block font-medium">
                    Professional Headline
                  </label>{" "}
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input input-bordered rounded-2xl outline-none focus:textarea-primary text-base"
                    placeholder="Expert Senior Technical Trainer"
                  />{" "}
                </div>{" "}
                <div className="form-control mt-4">
                  {" "}
                  <label className="label-text mb-2 block font-medium">
                    Full Biography
                  </label>{" "}
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-40 rounded-2xl outline-none focus:textarea-primary text-base"
                    placeholder="Describe the trainer's journey, methodology, and key achievements..."
                  />{" "}
                </div>{" "}
              </div>{" "}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-4 pb-12">
              <Link href="/admin/trainers" className="btn btn-ghost px-8">
                Discard
              </Link>
              <button
                type="submit"
                className="btn btn-primary btn-md gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Save & Publish Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
