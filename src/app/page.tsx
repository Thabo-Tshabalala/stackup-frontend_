"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  MessageCircle,
  DollarSign,
  MessageSquare,
  Repeat,
} from "lucide-react";
import { ROUTES } from "@/routes";

const LandingPage = () => {
  return (
    <div className="min-h-screen font-sans bg-gradient-to-tr from-indigo-50 to-purple-50 flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-6 bg-white/90 backdrop-blur-md shadow-md">
        <Image src="/logo.png" alt="StackUp Logo" width={120} height={40} />
        <nav className="space-x-4">
          <Link href={ROUTES.LOGIN}>
            <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold cursor-pointer">
              Sign In
            </span>
          </Link>
          <Link href={ROUTES.SIGNUP}>
            <span className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-semibold cursor-pointer">
              Sign Up
            </span>
          </Link>
        </nav>
      </header>

      <main className="flex-1 pt-28">
        {/* Hero Section */}
        <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 py-20 max-w-7xl mx-auto gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Save, Share & Grow Your Money Effortlessly
            </h1>
            <p className="text-gray-700 text-lg mb-8">
              StackUp lets you create instant wallets, send or receive funds
              with friends, and join group savings pools. All your money is
              ready to use anytime, anywhere.
            </p>
            <Link href={ROUTES.SIGNUP}>
              <span className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition cursor-pointer">
                Get Started
              </span>
            </Link>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="w-72 h-[600px] bg-gray-900 rounded-3xl shadow-2xl relative overflow-hidden border-8 border-gray-800">
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <Image
                  src="/home.png"
                  alt="Phone Dashboard"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-3xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>


<section className="px-6 py-16">
  <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
    What You Can Do with StackUp
  </h2>

  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">

    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
      <ArrowUpRight size={40} className="text-indigo-600 mb-4 mx-auto" />
      <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
        Wallet & Payments
      </h3>
      <p className="text-gray-700 text-sm text-center">
        Send and receive funds instantly, create group savings pools, and track balances easily.
      </p>
    </div>

    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
      <Users size={40} className="text-teal-500 mb-4 mx-auto" />
      <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Pools</h3>
      <p className="text-gray-700 text-sm text-center">
        Join or create pools, see progress bars for pool goals, and celebrate milestones together.
      </p>
    </div>

    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
      <Repeat size={40} className="text-green-600 mb-4 mx-auto" />
      <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Auto Payments & Pools</h3>
      <p className="text-gray-700 text-sm text-center">
        Receive your share automatically from savings pools, no manual transfers, no waiting. Payments are deposited directly into your account.
      </p>
    </div>


    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
        <div className="text-green-600 mb-4 mx-auto w-10 h-10 rounded-full border border-green-600 flex items-center justify-center font-bold text-lg">
        R
      </div>
      <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Send Money via Phone or Email</h3>
      <p className="text-gray-700 text-sm text-center">
        Quickly send money to anyone using their phone number or email. Funds are transferred directly to their account safely and instantly.
      </p>
    </div>
  </div>


  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 max-w-6xl mx-auto mt-8">
    <MessageSquare size={40} className="text-green-500 mb-4 mx-auto" />
    <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">WhatsApp Notifications</h3>
    <p className="text-gray-700 text-sm text-center">
      Stay updated in real-time! Get WhatsApp notifications for every pool event—new members joining, payments made, payments deducted, and more.
    </p>
  </div>
</section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-6 text-center mt-auto">
        <p className="text-gray-700 mb-2">
          &copy; 2025 StackUp. All rights reserved.
        </p>
        <div className="space-x-4">
          <Link
            href={ROUTES.SUPPORT}
            className="text-gray-700 hover:text-indigo-600"
          >
            Support
          </Link>
          <Link
            href={ROUTES.CONTACT}
            className="text-gray-700 hover:text-indigo-600"
          >
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
