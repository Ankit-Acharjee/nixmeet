import Bottombar from "@/components/Bottombar";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "YOOM",
  description: "Video conferencing app",
  icons:{
    icon: '/icons/logo.svg'
  }
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
  //{children}: {children: ReactNode} would mean “children is an object, and it has a property called children of type ReactNode”.
  return (
    <>
      <main className="relative">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
            <div className="w-full">{children}</div>
          </section>
        </div>
      <Bottombar />
      </main>
    </>
  );
};

export default HomeLayout;
