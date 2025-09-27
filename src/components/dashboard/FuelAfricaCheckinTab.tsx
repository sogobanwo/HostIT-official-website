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

type FuelAfricaRegistration = {
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
  timestamp?: string | null;
};

const FuelAfricaCheckinTab = ({ sheetId }: { sheetId: string }) => {
  const [registrations, setRegistrations] = useState<FuelAfricaRegistration[]>([]);
  const [registeredCount, setRegisteredCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Typeahead
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState<FuelAfricaRegistration[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Modal
  const [selected, setSelected] = useState<FuelAfricaRegistration | null>(null);
  const [selectedVerified, setSelectedVerified] = useState<boolean | null>(
    null
  );
  const [verifying, setVerifying] = useState(false);

  const [verifiedEmails, setVerifiedEmails] = useState<Set<string>>(new Set());

  /** Fetch registrations from Google Sheets */
  const fetchRegistrationsFromSheets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sheets/${sheetId}?range=Form%20Responses%201`);
      if (!res.ok) {
        throw new Error("Failed to fetch registrations from Google Sheets");
      }
      
      const response = await res.json();
      
      // Check if there's an error in the response
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Transform Google Sheets data to match our Registration type
      const transformedData: FuelAfricaRegistration[] = response.data.map((row: any, index: number) => {
        // Map the Google Form response fields to our registration type
        return {
          id: index + 1,
          timestamp: row["Timestamp"] || null,
          name: row["Full Name (Required)"] || null,
          email: row["Email Address (Required)"] || "",
          phone: row["Phone Number (WhatsApp Preferred) (Required)"] || null,
          role: row["Current Role (Multiple choice)"] || null,
          country: null, // Not in the form
          location: null, // Not in the form
          gender: null, // Not in the form
          github: null, // Not in the form
          telegramusername: null, // Not in the form
          xhandle: null, // Not in the form
        };
      });

      // Filter out empty entries
      const filteredData = transformedData.filter((reg) => 
        reg.email && reg.email.includes("@")
      );

      setRegistrations(filteredData.reverse()); // Most recent first
      setRegisteredCount(filteredData.length);
    } catch (e) {
      console.error(e);
      toast.error("Could not load registrations from Google Sheets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sheetId) {
      fetchRegistrationsFromSheets();
    }
  }, [sheetId]);

  /** Search suggestions (local filtering) */
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
  const openAttendee = async (att: FuelAfricaRegistration) => {
    setSelected(att);
    setSuggestions([]);
    setEmail(att.email);

    // Check if already verified locally
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
          event: "fuel-africa",
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
        Check Fuel Africa Attendee In
      </h1>

      {/* Search + Tracker */}
      <div className="border border-white rounded-3xl flex flex-col lg:flex-row gap-6 lg:gap-10 w-full py-6 px-4 sm:py-7 sm:px-7">
        {/* Left */}
        <div className="w-full lg:w-3/5 flex flex-col gap-4 sm:gap-6">
          <div className="flex justify-between items-start">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              FUEL AFRICA CHECKIN
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
              Data is fetched from Google Forms responses via Google Sheets API
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
            <p className="text-lg text-white">FUEL AFRICA TRACKER</p>
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
                {verifiedCount}
              </h1>
              <p className="text-xs">Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">
            All Fuel Africa Registrations (from Google Sheets)
          </h2>
          <Button
            onClick={fetchRegistrationsFromSheets}
            disabled={loading}
            className="bg-subsidiary hover:bg-white hover:text-subsidiary"
          >
            {loading ? "Refreshing..." : "Refetch from Sheets"}
          </Button>
        </div>

        {/* Loader when fetching */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-subsidiary"></div>
            <span className="ml-4 text-white text-lg">Loading attendees from Google Sheets...</span>
          </div>
        ) : (
          <div className="rounded-xl border border-white/20 max-h-[70vh] overflow-y-auto">
            <Table className="w-full">
              <TableHeader className="sticky top-0 bg-black/60 backdrop-blur z-10">
                <TableRow>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Role</TableHead>
                  <TableHead className="text-white">Country</TableHead>
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
                      <TableCell className="text-white">
                        {r.country || "—"}
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
              Fuel Africa Attendee Details
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
                  <b>Gender:</b> {selected.gender || "N/A"}
                </p>
                <p>
                  <b>Country:</b> {selected.country || "N/A"}
                </p>
                <p>
                  <b>Location:</b> {selected.location || "N/A"}
                </p>
                <p>
                  <b>Role:</b> {selected.role || "N/A"}
                </p>
                <p>
                  <b>Telegram:</b> {selected.telegramusername || "N/A"}
                </p>
                <p>
                  <b>X:</b> {selected.xhandle || "N/A"}
                </p>
                <p>
                  <b>GitHub:</b> {selected.github || "N/A"}
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

export default FuelAfricaCheckinTab;