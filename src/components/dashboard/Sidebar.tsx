"use client";

import { MdExplore } from "react-icons/md";
import { HiTicket } from "react-icons/hi2";
import { IoIosCreate } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { IoMdAnalytics } from "react-icons/io";


const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (route: string) => pathname.includes(route.replace("/", ""));
  const isOrganizer = isActive("/dashboard/organizer");


  const renderIcon = (
    icon: React.ReactNode,
    route: string,
    fallback: string = "/"
  ) => (
    <div
      className={`${
        isActive(route) ? "bg-subsidiary" : ""
      } hover:bg-subsidiary flex justify-center items-center rounded-full h-10 w-10 md:h-10 md:w-10 lg:h-14 lg:w-14 cursor-pointer`}
      onClick={() => router.push(isActive("/dashboard") ? route : fallback)}
    >
      {icon}
    </div>
  );

  return (
    <>
      {/* Left Sidebar (Desktop & Tablets) */}
      <div className="hidden md:flex fixed top-[12vh] left-0 w-[10%] lg:w-[7%] h-[88vh] flex-col items-center justify-between pt-12 pb-20 z-50">
        <div className="flex flex-col gap-5 items-center">
          <div className="border-subsidiary border rounded-full flex flex-col justify-center items-center gap-5 py-4 w-12 xl:w-16">
            {isOrganizer ? (
              <>
                {renderIcon(
                  <IoIosCreate
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    color="#FFF"
                  />,
                  "/dashboard/organizer/create-event",
                  "/organizer-login"
                )}
                {renderIcon(
                  <IoMdAnalytics
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    color="#FFF"
                  />,
                  "/dashboard/organizer/event-analytics"
                )}
                {renderIcon(
                  <MdExplore className="w-6 h-6 sm:w-7 sm:h-7" color="#FFF" />,
                  "/explore"
                )}
              </>
            ) : (
              <>
                {renderIcon(
                  <MdExplore className="w-6 h-6 sm:w-7 sm:h-7" color="#FFF" />,
                  "/dashboard/attendee/explore",
                  "/explore"
                )}
                {renderIcon(
                  <HiTicket className="w-6 h-6 sm:w-7 sm:h-7" color="#FFF" />,
                  "/dashboard/attendee/my-events",
                  "/attendee-login"
                )}
                {renderIcon(
                  <IoIosCreate
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    color="#FFF"
                  />,
                  "/dashboard/organizer/create-event",
                  "/organizer-login"
                )}
              </>
            )}
          </div>

          {/* User */}
        
        </div>
      </div>

      {/* Bottom Navbar (Mobile Only) */}
      <div className="fixed bottom-0 md:hidden w-full bg-principal z-50 py-2 px-4 flex justify-between items-center shadow-md">
        {isOrganizer ? (
          <>
            {renderIcon(
              <IoIosCreate className="w-6 h-6" color="#FFF" />,
              "/dashboard/organizer/create-event",
              "/organizer-login"
            )}
            {renderIcon(
              <IoMdAnalytics className="w-6 h-6" color="#FFF" />,
              "/dashboard/organizer/event-analytics"
            )}
            {renderIcon(
              <MdExplore className="w-6 h-6" color="#FFF" />,
              "/explore"
            )}
          </>
        ) : (
          <>
            {renderIcon(
              <MdExplore className="w-6 h-6" color="#FFF" />,
              "/dashboard/attendee/explore",
              "/explore"
            )}
            {renderIcon(
              <HiTicket className="w-6 h-6" color="#FFF" />,
              "/dashboard/attendee/my-events",
              "/attendee-login"
            )}
            {renderIcon(
              <IoIosCreate className="w-6 h-6" color="#FFF" />,
              "/dashboard/organizer/create-event",
              "/organizer-login"
            )}
          </>
        )}

      </div>
    </>
  );
};

export default Sidebar;
