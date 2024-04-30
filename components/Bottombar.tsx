"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { Tooltip } from "@nextui-org/react";

const Bottombar = () => {
  const pathname = usePathname();
  return (
    <section className="bottombar sticky bottom-0 z-10 w-full rounded-t-3xl bg-glassmorphism p-4 backdrop-blur-lg xs:px-7 md:hidden">
      <div className="bottombar_container flex items-center justify-between gap-3 xs:gap-5">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route ;

          return (
            <Link
              key={item.label}
              href={item.route}
              className={`relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5 ${isActive && "bg-blue-1"}`}
            >
              <Image
                src={item.imgUrl}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className="text-lg font-semibold max-lg:hidden">
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
