"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/api/api";

function SignIn() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Logging in with:", formData);

      const res = await API.post<{ token?: string; accessToken?: string }>("/login", {
        email: formData.emailOrPhone,
        password: formData.password,
      });

      const token = res.data.token || res.data.accessToken;
      if (token) localStorage.setItem("token", token);

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (typeof err === "object" && err !== null && "response" in err && (err as any).response?.data?.message) ||
        (typeof err === "object" && err !== null && "message" in err && (err as { message?: string }).message) ||
        "Login failed";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">Welcome Back</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700">
              Email or Phone
            </label>
            <input
              id="emailOrPhone"
              name="emailOrPhone"
              type="text"
              required
              placeholder="Enter your email or phone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
