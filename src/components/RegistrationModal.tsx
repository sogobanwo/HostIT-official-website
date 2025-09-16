"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
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
        onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-[#131939] border-subsidiary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Register for Fuel Africa Event
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Join us in empowering Africa's Web3 future. Please fill out the form below to register.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-subsidiary"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-subsidiary"
              maxLength={254}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-subsidiary"
              maxLength={15}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-subsidiary"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-subsidiary"
              maxLength={200}
              placeholder="City, State/Province"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-500 bg-[#131939] text-white focus:outline-none focus:border-subsidiary"
            >
              <option value="">Select gender (optional)</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              GitHub Profile
            </label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-subsidiary"
              maxLength={100}
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Telegram Username
            </label>
            <input
              type="text"
              name="telegramusername"
              value={formData.telegramusername}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-subsidiary"
              maxLength={200}
              placeholder="@username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              X (Twitter) Handle
            </label>
            <input
              type="text"
              name="xhandle"
              value={formData.xhandle}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-subsidiary"
              maxLength={200}
              placeholder="@username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Role/Profession
            </label>
            <textarea
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-500 bg-transparent text-white placeholder:text-gray-500 focus:outline-none focus:border-subsidiary resize-none"
              maxLength={2000}
              placeholder="Tell us about your role, profession, or what you do..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 px-4 rounded-lg border border-gray-500 text-white hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 px-4 rounded-lg bg-subsidiary hover:bg-white hover:text-subsidiary text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;