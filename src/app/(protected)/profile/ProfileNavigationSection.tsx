import { JSX } from "react";

export const ProfileNavigationSection = (): JSX.Element => {
  return (
    <header className="inline-flex flex-col items-start justify-center gap-0.5 absolute top-[41px] left-10">
      <h1 className="relative w-fit mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-black text-[32px] tracking-[0.64px] leading-[normal]">
        Profile &amp; Settings
      </h1>

      <p className="relative w-fit [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#c7c7c7] text-sm tracking-[0.28px] leading-[normal]">
        Manage your personal information, security, notifications, and billing
      </p>
    </header>
  );
};
