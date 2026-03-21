"use client";

import Header from "@/components/shared-components/Header";
import Footer from "@/components/shared-components/Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaRocket,
  FaCheckCircle,
  FaCode,
  FaClock,
  FaLock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  MdAnalytics,
  MdEventAvailable,
  MdPayments,
  MdPhoneIphone,
} from "react-icons/md";
import { IoTicket } from "react-icons/io5";
import { HiCurrencyDollar } from "react-icons/hi2";
import { FaAward } from "react-icons/fa6";
import { BiWorld } from "react-icons/bi";
import React, { useRef, useState, useEffect } from "react";

type Phase = {
  month: string;
  title: string;
  status: "completed" | "in-progress" | "upcoming";
  items: { text: string; icon: React.ReactNode; done: boolean }[];
};

const phases: Phase[] = [
  {
    month: "Jan 2025",
    title: "Project Kickoff",
    status: "completed",
    items: [
      { text: "Official website launch", icon: <FaRocket size={16} />, done: true },
      { text: "Brand identity & design system", icon: <FaCode size={16} />, done: true },
    ],
  },
  {
    month: "Feb 2025",
    title: "Core Ticketing",
    status: "completed",
    items: [
      { text: "Event page with registration & ticketing", icon: <IoTicket size={16} />, done: true },
      { text: "QR-code check-in system", icon: <MdEventAvailable size={16} />, done: true },
    ],
  },
  {
    month: "Mar 2025",
    title: "Analytics & Integrations",
    status: "completed",
    items: [
      { text: "Real-time event analytics dashboard", icon: <MdAnalytics size={16} />, done: true },
      { text: "Luma & Google Sheets integrations", icon: <FaCode size={16} />, done: true },
    ],
  },
  {
    month: "Apr 2025",
    title: "Multi-Event Support",
    status: "in-progress",
    items: [
      { text: "Multi-event support & organizer dashboard", icon: <MdEventAvailable size={16} />, done: true },
      { text: "POAP / digital collectible distribution", icon: <FaAward size={16} />, done: false },
    ],
  },
  {
    month: "May 2025",
    title: "On-Chain Payments",
    status: "upcoming",
    items: [
      { text: "Escrow-backed ticket payments", icon: <HiCurrencyDollar size={16} />, done: false },
      { text: "On-chain ticket verification (Lisk L2)", icon: <FaLock size={16} />, done: false },
    ],
  },
  {
    month: "Jun 2025",
    title: "Mobile App",
    status: "upcoming",
    items: [
      { text: "HostIT mobile app (iOS & Android)", icon: <MdPhoneIphone size={16} />, done: false },
      { text: "Push notifications & mobile check-in", icon: <MdPhoneIphone size={16} />, done: false },
    ],
  },
  {
    month: "Jul 2025",
    title: "Payment Gateway",
    status: "upcoming",
    items: [
      { text: "Fiat & crypto payment gateway", icon: <MdPayments size={16} />, done: false },
      { text: "Organizer payout & revenue analytics", icon: <MdAnalytics size={16} />, done: false },
    ],
  },
  {
    month: "Aug 2025",
    title: "Developer Platform",
    status: "upcoming",
    items: [
      { text: "Public API for third-party integrations", icon: <FaCode size={16} />, done: false },
      { text: "Developer documentation & SDK", icon: <FaCode size={16} />, done: false },
    ],
  },
  {
    month: "Sep 2025",
    title: "Multi-Chain",
    status: "upcoming",
    items: [
      { text: "Multi-chain support & cross-chain tickets", icon: <BiWorld size={16} />, done: false },
      { text: "Wallet abstraction & gasless transactions", icon: <FaLock size={16} />, done: false },
    ],
  },
  {
    month: "Oct 2025",
    title: "Governance",
    status: "upcoming",
    items: [
      { text: "DAO governance for platform decisions", icon: <FaLock size={16} />, done: false },
      { text: "Community voting & proposals", icon: <BiWorld size={16} />, done: false },
    ],
  },
  {
    month: "Nov 2025",
    title: "Enterprise",
    status: "upcoming",
    items: [
      { text: "White-label solution for enterprise clients", icon: <FaRocket size={16} />, done: false },
      { text: "Custom branding & dedicated support", icon: <FaRocket size={16} />, done: false },
    ],
  },
  {
    month: "Dec 2025",
    title: "Global Launch",
    status: "upcoming",
    items: [
      { text: "Global event marketplace launch", icon: <BiWorld size={16} />, done: false },
      { text: "Strategic partnerships & ecosystem growth", icon: <BiWorld size={16} />, done: false },
    ],
  },
];

const statusConfig = {
  completed: {
    color: "bg-green-500",
    border: "border-green-500/30",
    text: "text-green-400",
    label: "Completed",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]",
    dotRing: "ring-green-500/30",
  },
  "in-progress": {
    color: "bg-subsidiary",
    border: "border-subsidiary/30",
    text: "text-subsidiary",
    label: "In Progress",
    glow: "shadow-[0_0_20px_rgba(0,124,250,0.2)]",
    dotRing: "ring-subsidiary/30",
  },
  upcoming: {
    color: "bg-gray-600",
    border: "border-gray-600/30",
    text: "text-gray-400",
    label: "Upcoming",
    glow: "",
    dotRing: "ring-gray-600/30",
  },
};

function PhaseCard({ phase, index }: { phase: Phase; index: number }) {
  const config = statusConfig[phase.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center flex-shrink-0 w-[260px] md:w-[280px]"
    >
      {/* Month label above the dot */}
      <span className={`text-sm font-mono font-semibold ${config.text} mb-3`}>
        {phase.month}
      </span>

      {/* Timeline dot */}
      <div className="relative mb-6">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, type: "spring", delay: index * 0.1 }}
          className={`w-5 h-5 rounded-full ${config.color} ring-4 ${config.dotRing} z-10 relative`}
        />
        {phase.status === "in-progress" && (
          <div className="absolute inset-0 w-5 h-5 rounded-full bg-subsidiary animate-ping opacity-30" />
        )}
      </div>

      {/* Card */}
      <div
        className={`rounded-xl border ${config.border} bg-[#1a2147]/80 backdrop-blur-sm p-5 w-full ${config.glow} hover:translate-y-[-4px] transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-white">{phase.title}</h3>
          <span
            className={`text-[11px] font-medium ${config.text} flex items-center gap-1 whitespace-nowrap`}
          >
            {phase.status === "completed" && <FaCheckCircle size={10} />}
            {phase.status === "in-progress" && (
              <FaClock size={10} className="animate-pulse" />
            )}
            {config.label}
          </span>
        </div>

        <ul className="space-y-2.5">
          {phase.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className={`mt-0.5 shrink-0 ${item.done ? "text-green-400" : "text-gray-500"}`}
              >
                {item.done ? <FaCheckCircle size={14} /> : item.icon}
              </span>
              <span
                className={`text-[13px] leading-snug ${item.done ? "text-text/60 line-through" : "text-text"}`}
              >
                {item.text}
              </span>
            </li>
          ))}
        </ul>

        {phase.status === "in-progress" && (
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="flex justify-between text-[11px] text-text/70 mb-1.5">
              <span>Progress</span>
              <span>
                {phase.items.filter((i) => i.done).length}/{phase.items.length}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width: `${(phase.items.filter((i) => i.done).length / phase.items.length) * 100}%`,
                }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-subsidiary to-blue-400 rounded-full"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function RoadmapPage() {
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="mx-auto space-y-8">
      <Header />

      <div className="min-h-screen py-12 md:py-20">
        {/* Page Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-[800px] mx-auto text-center mb-16 md:mb-24 px-4"
        >
          <div className="flex justify-center mb-4">
            <h4 className="px-8 py-2 rounded-full border border-subsidiary bg-gradient-to-r from-[#007CFA] from-30% to-white to-80% bg-clip-text font-semibold text-transparent">
              ROADMAP
            </h4>
          </div>
          <h1 className="text-4xl md:text-6xl md:leading-relaxed font-semibold md:font-normal bg-gradient-to-r from-[#007CFA] from-30% to-white to-95% bg-clip-text text-transparent">
            Where We&apos;re Headed
          </h1>
          <p className="text-lg text-text mt-4 max-w-[500px] mx-auto">
            Our journey to building the most transparent and seamless event
            ticketing platform on the blockchain.
          </p>
        </motion.div>

        {/* Timeline section */}
        <div className="relative">
          {/* Navigation arrows */}
          <button
            onClick={() => scroll("left")}
            className={`absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#1a2147] border border-subsidiary/30 flex items-center justify-center text-white transition-opacity duration-300 hover:bg-subsidiary/20 ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#1a2147] border border-subsidiary/30 flex items-center justify-center text-white transition-opacity duration-300 hover:bg-subsidiary/20 ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <FaChevronRight size={14} />
          </button>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-[#131939] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-[#131939] to-transparent z-10 pointer-events-none" />

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="relative px-12 md:px-24 py-4">
              {/* Horizontal connecting line */}
              <div
                className="absolute left-12 right-12 md:left-24 md:right-24 h-0.5 bg-gradient-to-r from-green-500/50 via-subsidiary/50 to-gray-600/30"
                style={{ top: "calc(20px + 0.75rem + 12px + 10px)" }}
              />

              {/* Cards row */}
              <div className="flex gap-6 md:gap-8 w-max">
                {phases.map((phase, index) => (
                  <PhaseCard key={phase.month} phase={phase} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-24 px-4"
        >
          <p className="text-text text-lg mb-6">
            Want to be part of the journey?
          </p>
          <a
            href="https://calendly.com/hostit-chat/30min"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="px-8 py-3 bg-subsidiary text-white rounded-lg text-lg hover:bg-blue-600 transition-colors">
              Get in Touch
            </button>
          </a>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
