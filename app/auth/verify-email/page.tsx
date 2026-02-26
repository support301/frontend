

"use client";
import Link from "next/link";
import { useFormik } from "formik";
import { verifyEmailSchema } from "@/app/validations/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVerifyEmailMutation } from "@/app/services/userauth";

const initialValues = {
  email: "",
  otp: "",
};

const VerifyEmail = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [verifyEmail] = useVerifyEmailMutation();

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: verifyEmailSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      try {
        const response = await verifyEmail(values);
        if (response.data && response.data.status === "success") {
          setServerSuccessMessage(response.data.message);
          setServerErrorMessage("");
          action.resetForm();
          setLoading(false);
          router.push("/auth/login");
        }
        if (
          response.error &&
          "data" in response.error &&
          (response.error.data as any).status === "failed"
        ) {
          setServerErrorMessage(
            (response.error.data as { message: string }).message
          );
          setServerSuccessMessage("");
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex h-screen bg-black text-white p-4">
      {/* Left Gradient Card */}
      <div className="hidden relative grid-lines lg:flex w-2/3 flex-col items-center justify-center p-12 bg-gradient-to-b from-blue-500 to-black rounded-t-3xl">
        <h2 className="text-3xl font-bold mb-3">Arun Tgak</h2>
        <h1 className="text-xl mb-4">Verify Your Email</h1>
        <p className="text-gray-300 mb-8 text-center">
          Enter your registered email and OTP to verify your account.
        </p>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full lg:w-1/3 flex-col justify-center px-8 md:px-20">
        <h2 className="text-3xl font-bold mb-2">Verify Email</h2>
        <p className="text-gray-400 mb-6">Check your email for OTP.</p>

        {serverErrorMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {serverErrorMessage}
          </div>
        )}
        {serverSuccessMessage && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
            {serverSuccessMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
          </div>

          {/* OTP */}
          <div>
            <input
              type="text"
              name="otp"
              placeholder="Enter your OTP"
              value={values.otp}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.otp && (
              <div className="text-red-500 text-sm mt-1">{errors.otp}</div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-4 text-center">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-400 hover:underline transition"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
