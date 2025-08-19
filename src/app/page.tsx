"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, ArrowUpRight, ArrowDownLeft, Flame, MessageCircle } from "lucide-react";
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

        <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 py-20 max-w-7xl mx-auto gap-12">

          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Save, Share & Grow Your Money Effortlessly
            </h1>
            <p className="text-gray-700 text-lg mb-8">
              StackUp lets you create instant wallets, send or receive funds with friends, 
              and join group savings pools. All your money is ready to use anytime, anywhere.
            </p>
            <Link href={ROUTES.SIGNUP}>
              <span className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition cursor-pointer">
                Get Started
              </span>
            </Link>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="w-72 h-[600px] bg-indigo-200 rounded-3xl shadow-xl flex items-center justify-center">
              <span className="text-indigo-700 font-bold">Phone Dashboard</span>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What you can do with StackUp</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <ArrowUpRight size={40} className="text-indigo-600 mb-4 mx-auto"/>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Wallet & Payments</h3>
              <p className="text-gray-700 text-sm text-center">
                Send and receive funds instantly, create group savings pools, and track balances easily.
              </p>
            </div>


            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <Users size={40} className="text-teal-500 mb-4 mx-auto"/>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Groups & Community</h3>
              <p className="text-gray-700 text-sm text-center">
                Join or create groups, see progress bars for group goals, and celebrate milestones together.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <ArrowDownLeft size={40} className="text-yellow-500 mb-4 mx-auto"/>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Quick Actions</h3>
              <p className="text-gray-700 text-sm text-center">
                Send or receive money quickly, create new pools, and get instant notifications for activity.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <Flame size={40} className="text-red-500 mb-4 mx-auto"/>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Gamified Rewards</h3>
              <p className="text-gray-700 text-sm text-center">
                Earn streaks, badges, and rewards as you save, making money management fun.
              </p>
            </div>

          </div>
        </section>

      </main>

      <footer className="bg-gray-100 p-6 text-center mt-auto">
        <p className="text-gray-700 mb-2">&copy; 2025 StackUp. All rights reserved.</p>
        <div className="space-x-4">
          <Link href={ROUTES.SUPPORT} className="text-gray-700 hover:text-indigo-600">Support</Link>
          <Link href={ROUTES.CONTACT} className="text-gray-700 hover:text-indigo-600">Contact</Link>
        </div>
      </footer>

      <div className="fixed bottom-4 right-4">
        <button className="bg-teal-500 text-white rounded-full p-3 shadow-lg hover:bg-teal-600 transition">
          <MessageCircle size={24} />
        </button>
      </div>

    </div>
  );
};

export default LandingPage;
