"use client";

import React, { useEffect, useRef, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { MdOutlineQrCodeScanner, MdAnalytics } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
// Using server API route to avoid CORS when calling Luma directly

type Registration = {
  id: number | string;
  name: string | null;
  email: string;
  phone?: string | null;
  country?: string | null;
  location?: string | null;
  gender?: string | null;
  github?: string | null;
  telegramusername?: string | null;
  xhandle?: string | null;
  role?: string | null;
};

const BASE = process.env.NEXT_PUBLIC_BASE_URL;
const LUMA_EVENT_ID = process.env.NEXT_PUBLIC_LUMA_EVENT_ID || "";

const CheckInTab = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registeredCount, setRegisteredCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Typeahead
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState<Registration[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Modal
  const [selected, setSelected] = useState<Registration | null>(null);
  const [selectedVerified, setSelectedVerified] = useState<boolean | null>(
    null
  );
  const [verifying, setVerifying] = useState(false);

  const [verifiedEmails, setVerifiedEmails] = useState<Set<string>>(new Set());
  const [verifiedTodayCount, setVerifiedTodayCount] = useState<number>(0);

  /** Fetch ALL registrations from Luma for this event (via server route) */
  const fetchAllRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/luma/get-guests?event_api_id=${encodeURIComponent(
          LUMA_EVENT_ID
        )}&pagination_limit=5000&all=1`
      );
      if (!res.ok) throw new Error(`Failed to fetch guests: ${res.status}`);
      const data = await res.json();
      const entries = (data?.entries || []) as any[];
      const mapped: Registration[] = entries.map((g: any, index: number) => ({
        id: `${g?.guest.user_email || g?.guest.email || index}-${index}`,
        name: g?.guest.user_name || null,
        email: g?.guest.user_email || g?.guest.email || "",
        phone: null,
        location: g?.guest.registration_answers[1].answer,
        role: g?.guest.registration_answers[0].answer,
      }));
      setRegistrations(mapped);
      setRegisteredCount(mapped.length);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Could not load registrations from Luma");
    } finally {
      setLoading(false);
    }
  };

  /** Fetch TODAY verified count from attendance API (server proxy) */
  const fetchVerifiedTodayCount = async () => {
    try {
      const res = await fetch(`/api/attendance/verified-count`);
      if (!res.ok) throw new Error(`Failed to fetch verified count: ${res.status}`);
      const data = await res.json();
      const c = typeof data?.count === "number" ? data.count : 0;
      setVerifiedTodayCount(c);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Could not load today's verified count");
    }
  };

  useEffect(() => {
    fetchAllRegistrations();
    fetchVerifiedTodayCount();
  }, []);

  /** Search suggestions (API-based) */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const filtered = registrations.filter((r) =>
        r.email.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 10));
    }, 200);
  };

  /** Open attendee details in modal */
  const openAttendee = async (att: Registration) => {
    setSelected(att);
    setSuggestions([]);
    setEmail(att.email);

    try {
      const res = await fetch(
        `${BASE}api/verify-status?email=${encodeURIComponent(att.email)}`
      );
      if (res.ok) {
        const data = await res.json();
        const v = !!data?.verified;
        setSelectedVerified(v);
        if (v) setVerifiedEmails((prev) => new Set(prev).add(att.email));
        return;
      }
    } catch {
      // fallback
    }

    setSelectedVerified(verifiedEmails.has(att.email));
  };

  /** Verify attendee */
  const handleVerify = async () => {
    if (!selected) return;
    setVerifying(true);
    try {
      const res = await fetch(`https://hostit-backend-v2.onrender.com/api/attendance/verify-offchain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selected.email,
          event: "the-elite-experience",
          day: 1,
        }),
      });
      if (!res.ok) throw new Error("Verification failed");

      toast.success("Attendee verified successfully");
      setVerifiedEmails((prev) => new Set(prev).add(selected.email));
      setSelectedVerified(true);
    } catch (e) {
      console.error(e);
      toast.error("Unable to verify attendee");
    } finally {
      setVerifying(false);
    }
  };

  const verifiedCount = Array.from(verifiedEmails).length;

  return (
    <div>
      {/* Header */}
      <h1 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-[#007CFA] to-white bg-clip-text text-transparent inline-flex my-4">
        Check Attendee In
      </h1>

      {/* Search + Tracker */}
      <div className="border border-white rounded-3xl flex flex-col lg:flex-row gap-6 lg:gap-10 w-full py-6 px-4 sm:py-7 sm:px-7">
        {/* Left */}
        <div className="w-full lg:w-3/5 flex flex-col gap-4 sm:gap-6">
          <div className="flex justify-between items-start">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              CHECKIN
            </h1>
            <MdOutlineQrCodeScanner size={32} className="sm:w-10 sm:h-10" />
          </div>

          <ul className="flex flex-col gap-2 text-white">
            <li className="flex items-start gap-2 text-xs sm:text-sm">
              <GoDotFill className="mt-1 flex-shrink-0" />
              Search by attendee email address or scan their QR code
            </li>
            <li className="flex items-start gap-2 text-xs sm:text-sm">
              <GoDotFill className="mt-1 flex-shrink-0" />
              Check in attendee and wait for on-chain confirmation.
            </li>
            <li className="flex items-start gap-2 text-xs sm:text-sm">
              <GoDotFill className="mt-1 flex-shrink-0" />
              Data is fetched via Luma API for this event
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 relative">
            <Input
              placeholder="Enter attendee's email address"
              className="w-full sm:w-3/4 h-12 px-4 sm:px-10"
              value={email}
              onChange={handleInputChange}
              autoComplete="off"
            />
            <Button
              className="w-full sm:w-1/4 py-4 bg-subsidiary h-12 hover:bg-white hover:text-subsidiary"
              disabled={!email}
              onClick={() => {
                const match = registrations.find(
                  (r) => r.email.toLowerCase() === email.toLowerCase()
                );
                if (match) openAttendee(match);
                else toast("No attendee found for that email");
              }}
            >
              Search
            </Button>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute top-14 left-0 w-full sm:w-3/4 bg-white text-black rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto border">
                {suggestions.map((att) => (
                  <li
                    key={att.id}
                    className="px-4 py-2 hover:bg-subsidiary hover:text-white cursor-pointer"
                    onClick={() => openAttendee(att)}
                  >
                    {att.email}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Tracker */}
        <div className="w-full lg:w-2/5 flex flex-col justify-between py-6 px-4 sm:px-8 rounded-xl bg-subsidiary text-white">
          <div className="flex items-center gap-2">
            <MdAnalytics size={20} />
            <p className="text-lg text-white">TRACKER</p>
          </div>
          <div className="flex justify-between mt-4">
            <div className="flex flex-col items-start">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {registeredCount}
              </h1>
              <p className="text-xs">Registered</p>
            </div>
            <div className="flex flex-col items-end">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {verifiedTodayCount}
              </h1>
              <p className="text-xs">Verified Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-white">
      All Registrations
    </h2>
    <Button
      onClick={fetchAllRegistrations}
      disabled={loading}
      className="bg-subsidiary hover:bg-white hover:text-subsidiary"
    >
      {loading ? "Refreshing..." : "Refetch"}
    </Button>
  </div>

  {/* Loader when fetching */}
  {loading ? (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-subsidiary"></div>
      <span className="ml-4 text-white text-lg">Loading attendees...</span>
    </div>
  ) : (
    <div className="rounded-xl border border-white/20 max-h-[70vh] overflow-y-auto">
      <Table className="w-full">
        <TableHeader className="sticky top-0 bg-black/60 backdrop-blur z-10">
          <TableRow>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((r) => {
            const isVerified = verifiedEmails.has(r.email);
            return (
              <TableRow
                key={r.id}
                className="hover:bg-white/10 cursor-pointer"
                onClick={() => openAttendee(r)}
              >
                <TableCell className="text-white">
                  {r.name || "—"}
                </TableCell>
                <TableCell className="text-white">{r.email}</TableCell>
                <TableCell className="text-white">
                  {r.role || "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  )}
</div>

      {/* Attendee Modal */}
      <Dialog
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) {
            setSelected(null);
            setSelectedVerified(null);
          }
        }}
      >
        <DialogContent className="border bg-principal border-subsidiary rounded-3xl p-0 w-[90%] max-w-md">
          {/* Colored Header with Icon */}
          <div className="p-8 sm:p-12 rounded-t-3xl bg-subsidiary w-full flex justify-center items-center">
            <MdOutlineQrCodeScanner
              color="#ffffff"
              size={60}
              className="sm:w-[72px] sm:h-[72px]"
            />
          </div>
          {/* Centered Attendee Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-center items-center gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#007CFA] from-30% to-white to-95% bg-clip-text text-transparent text-center">
              Attendee Details
            </h1>
            {selected && (
              <div className="space-y-2 text-sm w-full max-w-xs mx-auto text-center">
                <p>
                  <b>Name:</b> {selected.name || "N/A"}
                </p>
                <p>
                  <b>Email:</b> {selected.email}
                </p>
                <p>
                  <b>Location:</b> {selected.location || "N/A"}
                </p>
                <p>
                  <b>Role:</b> {selected.role || "N/A"}
                </p>
                <p className="mt-2">
                  <b>Status:</b>{" "}
                  {selectedVerified === null
                    ? "Checking..."
                    : selectedVerified
                    ? "✅ Verified"
                    : "❌ Not Verified"}
                </p>
              </div>
            )}
            <div className="w-full flex justify-center mt-4">
              {selectedVerified ? (
                <Button disabled>Already Verified</Button>
              ) : (
                <Button
                  onClick={handleVerify}
                  disabled={verifying || !selected}
                  className="bg-subsidiary hover:bg-white hover:text-subsidiary"
                >
                  {verifying ? "Verifying..." : "Verify Attendee"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckInTab;
