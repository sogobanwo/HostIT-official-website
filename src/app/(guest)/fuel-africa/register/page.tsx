"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FaRocket, FaUsers, FaGlobe, FaCode } from "react-icons/fa";

interface GeneralRegistration {
  id?: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  location?: string;
  gender?: string;
  github?: string;
  telegramusername?: string;
  xhandle?: string;
  role?: string;
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<GeneralRegistration>({
    name: "",
    email: "",
    phone: "",
    country: "",
    location: "",
    gender: "",
    github: "",
    telegramusername: "",
    xhandle: "",
    role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof GeneralRegistration)[] = [
      "name", "email", "phone", "country"
    ];
    
    for (const field of requiredFields) {
      const value = formData[field];
      if (!value) return false;
      if (typeof value === "string" && value.trim() === "") return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/register-fuel-africa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Registration successful! Welcome to Fuel Africa Event.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          country: "",
          location: "",
          gender: "",
          github: "",
          telegramusername: "",
          xhandle: "",
          role: "",
        });
        toast.success("Registration successful! Check Email for confirmation.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#131939] via-[#1a1f3a] to-[#131939] overflow-hidden">
      <div className="2xl:max-w-[1200px] max-w-[1024px] mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Image
            src="/logo.png"
            width={149}
            height={47}
            alt="HostIt logo"
            className="mx-auto mb-8"
          />
          <h1 className="2xl:text-6xl text-4xl font-bold bg-gradient-to-r from-[#007CFA] from-30% to-white to-95% bg-clip-text text-transparent mb-4">
            Fuel Africa Event
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join us in empowering Africa's Web3 future. Register now to be part of this transformative event.
          </p>
        </motion.div>

        {/* Event Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="flex flex-col items-center text-center p-4">
            <FaRocket className="text-[#007CFA] text-3xl mb-2" />
            <h3 className="text-white font-semibold mb-1">Innovation</h3>
            <p className="text-gray-400 text-sm">Cutting-edge Web3 technologies</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <FaUsers className="text-[#007CFA] text-3xl mb-2" />
            <h3 className="text-white font-semibold mb-1">Networking</h3>
            <p className="text-gray-400 text-sm">Connect with industry leaders</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <FaGlobe className="text-[#007CFA] text-3xl mb-2" />
            <h3 className="text-white font-semibold mb-1">Global Impact</h3>
            <p className="text-gray-400 text-sm">Shape Africa's digital future</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <FaCode className="text-[#007CFA] text-3xl mb-2" />
            <h3 className="text-white font-semibold mb-1">Development</h3>
            <p className="text-gray-400 text-sm">Build the next generation</p>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <Card className="w-full max-w-2xl bg-transparent border border-gray-500 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Event Registration</h2>
              <p className="text-gray-300">Please fill out all required fields to complete your registration.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Required Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-[#007CFA] transition-colors"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-[#007CFA] transition-colors"
                    maxLength={254}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-[#007CFA] transition-colors"
                    maxLength={15}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-[#007CFA] transition-colors"
                    maxLength={100}
                    required
                  />
                </div>
              </div>

              {/* Optional Fields */}
              <div className="border-t border-gray-600 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Additional Information (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-[#007CFA] transition-colors"
                      maxLength={200}
                      placeholder="City, State/Province"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-lg border border-gray-500 bg-[#131939] text-white focus:outline-none focus:border-[#007CFA] transition-colors"
                    >
                      <option value="">Select gender (optional)</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-[#007CFA] transition-colors"
                      maxLength={100}
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Telegram Username
                    </label>
                    <input
                      type="text"
                      name="telegramusername"
                      value={formData.telegramusername}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-[#007CFA] transition-colors"
                      maxLength={200}
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      X (Twitter) Handle
                    </label>
                    <input
                      type="text"
                      name="xhandle"
                      value={formData.xhandle}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-[#007CFA] transition-colors"
                      maxLength={200}
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Role/Profession
                  </label>
                  <textarea
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-[#007CFA] transition-colors resize-none"
                    maxLength={2000}
                    placeholder="Tell us about your role, profession, or what you do in the Web3 space..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 px-6 rounded-lg bg-[#007CFA] hover:bg-white hover:text-[#007CFA] text-white font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Registering..." : "Register for Fuel Africa Event"}
                </button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;