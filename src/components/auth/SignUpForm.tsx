"use client";
import React, { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create user");

      const data = await response.json();
      console.log("User saved:", data);
   
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Sign up for StackUp
          </h2>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
     
          <div className="flex space-x-4">
            {["firstName", "lastName"].map((field) => (
              <div key={field} className="flex-1">
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field === "firstName" ? "First Name" : "Last Name"}
                </label>
                <input
                  id={field}
                  name={field}
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={field === "firstName" ? "John" : "Doe"}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

   
          {["email", "phone", "password"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700"
              >
                {field === "phone"
                  ? "Phone Number (WhatsApp)"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type={
                  field === "password"
                    ? "password"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={
                  field === "phone"
                    ? "e.g. +27 82 123 4567"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Sign Up
            </button>
          </div>
        </form>

       
        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm">
            Already have an account?
          </p>
          <a
            href="/signin"
            className="inline-block mt-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
