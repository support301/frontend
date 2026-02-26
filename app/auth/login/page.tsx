
"use client";
import Link from "next/link";
import { useFormik } from "formik";
import { loginSchema } from "@/app/validations/schemas";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLoginUserMutation } from "@/app/services/userauth";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
    const [step, setStep] = useState(1);
    const [serverErrorMessage, setServerErrorMessage] = useState("");
    const [serverSuccessMessage, setServerSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const [loginUser] = useLoginUserMutation();

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: loginSchema,
        onSubmit: async (values, action) => {
            setLoading(true);
            try {
                const response = await loginUser(values);

                if (response.data?.token) {
                    localStorage.setItem("token", response.data.token);
                }

                const role = response.data?.user?.roles?.[0];
                if (response.data?.status === "success") {
                    setServerSuccessMessage(response.data.message);
                    setServerErrorMessage("");
                    action.resetForm();
                    setStep(1);

                    const rolePaths: Record<string, string> = {
                        admin: "/admin",
                    };
                    router.push(rolePaths[role] ?? "/unauthorized");
                }

                if (response.error && "data" in response.error) {
                    setServerErrorMessage(
                        (response.error as { data: { message: string } }).data.message
                    );
                    setServerSuccessMessage("");
                }
            } catch (error) {
                setServerErrorMessage("Invalid email or password");
            } finally {
                setLoading(false);
            }
        },
    });

    const handleNext = () => {
        if (!formik.values.email) {
            setServerErrorMessage("Please enter your email");
            return;
        }
        setServerErrorMessage("");
        setStep(2);
    };

    return (
        <div className="flex h-screen bg-black text-white p-4">
            {/* Left Gradient Card */}

            <div className="hidden relative lg:flex w-2/3 flex-col items-center justify-center p-12 bg-gradient-to-b from-[#40E0D0] to-black rounded-t-3xl grid-lines  ">
                <h2 className="text-3xl font-bold mb-3">Arun Tgak</h2>
                <h1 className="text-4xl font-extrabold mb-4">Get Started with Us</h1>
                <p className="text-gray-300 mb-8 text-center">
                    Complete these easy steps to login to your account.
                </p>
            </div>


            {/* Right Login Form */}
            <div className="flex w-full lg:w-1/3 flex-col justify-center px-8 md:px-20">
                <h2 className="text-3xl font-bold mb-2">Log In</h2>
                <p className="text-gray-400 mb-6">Enter your details to continue</p>

                {serverErrorMessage && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
                        {serverErrorMessage}
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            placeholder="Enter your email"
                            className="w-full px-5 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleNext();
                            }}
                        />
                        {formik.errors.email && (
                            <div className="text-red-500 text-sm">{formik.errors.email}</div>
                        )}
                        <button
                            onClick={handleNext}
                            className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <p className="text-gray-400 mb-2">
                            Email: <span className="text-white">{formik.values.email}</span>
                        </p>

                        {/* Password Input */}
                        <div className="">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    placeholder="Enter your password"
                                    className="w-full px-5 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 "
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            formik.handleSubmit();
                                        }
                                    }}
                                />
                                <div
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </div>
                            </div>
                            {formik.errors.password && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            )}
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-blue-400 hover:underline text-sm"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-white text-black py-2 px-6 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </div>
                    </form>
                )}

                <div className="flex justify-between mt-4">

                    {/* Forgot Password */}
                    <p className="text-sm text-gray-300">
                        <Link
                            href="./reset-password-link"
                            className="text-blue-400 transition duration-300 ease-in-out"
                        >
                            Forgot?
                        </Link>
                    </p>

                    {/* Register Link */}
                    <p className="text-sm text-gray-300 text-center">
                        Not a User?{" "}
                        <Link href="./register" className="text-blue-400 hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
