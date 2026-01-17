import { JSX, useState } from "react";
import group10000030812 from "./group-1000003081-2.png";
import group1000003081 from "./group-1000003081.png";
import image from "./image.png";
import image1 from "../../../../public/profile/image.svg";
import location11 from "./location-1-1.png";
import pen1 from "./pen-1.png";
import trash1 from "./trash-1.png";
import vector902 from "../../../../public/profile/vector-90.svg";
import vector903 from "../../../../public/profile/vector-90.svg";
import vector90 from "../../../../public/profile/vector-90.svg";
import vector95 from "../../../../public/profile/vector-95.svg";
import vector143 from "../../../../public/profile/vector-144.svg";
import vector144 from "../../../../public/profile/vector-144.svg";
import vector145 from "../../../../public/profile/vector-145.svg";
import vector159 from "../../../../public/profile/vector-161.svg";
import vector160 from "../../../../public/profile/vector-160.svg";
import vector161 from "../../../../public/profile/vector-161.svg";

interface PersonalInfo {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
}

interface CompanyInfo {
  companyName: string;
  companyAddress: string;
}

interface PaymentMethod {
  id: string;
  cardImage: string;
  lastFourDigits: string;
  expiryDate: string;
  isDefault: boolean;
  trashIcon: string;
}

interface BillingHistoryItem {
  invoice: string;
  date: string;
  policy: string;
  amount: string;
  status: string;
  statusColor: string;
}

export const ProfileDetailsSection = (): JSX.Element => {
  const [personalInfo] = useState<PersonalInfo>({
    fullName: "Lucas Bennet",
    phoneNumber: "+1 (555) 123-4567",
    emailAddress: "lucaas.bennet@example.com",
  });

  const [companyInfo] = useState<CompanyInfo>({
    companyName: "Anderson & Co.",
    companyAddress: "123 Business Street, New York, NY 100001",
  });

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      cardImage: 'group1000003081',
      lastFourDigits: "•••• 4242",
      expiryDate: "Expires 09/25",
      isDefault: true,
      trashIcon: 'trash1',
    },
    {
      id: "2",
      cardImage: 'group10000030812',
      lastFourDigits: "•••• 4242",
      expiryDate: "Expires 09/25",
      isDefault: true,
      trashIcon: 'image',
    },
  ]);

  const [billingHistory] = useState<BillingHistoryItem[]>([
    {
      invoice: "INV-001",
      date: "Nov 1, 2025",
      policy: "P-0124",
      amount: "$1,245.00",
      status: "Paid",
      statusColor: "#cbd03c",
    },
    {
      invoice: "INV-001",
      date: "Nov 1, 2025",
      policy: "P-0124",
      amount: "$1,245.00",
      status: "Paid",
      statusColor: "#cbd03c",
    },
    {
      invoice: "INV-001",
      date: "Nov 1, 2025",
      policy: "P-0124",
      amount: "$1,245.00",
      status: "Paid",
      statusColor: "#cbd03c",
    },
  ]);

  const tableHeaders = [
    { label: "Invoice", icon: null },
    { label: "Date", icon: vector90 },
    { label: "Policy", icon: image1 },
    { label: "Amount", icon: vector902 },
    { label: "Status", icon: vector903 },
    { label: "Action", icon: vector95 },
  ];

  const tableHeaderPositions = [0, 209, 436, 641, 855, 1133];

  return (
    <section
      className="flex flex-col w-[1250px] h-[879px] items-start gap-6 p-6 absolute top-[136px] left-[438px] bg-[#fafcffcc] rounded-2xl"
      aria-labelledby="profile-heading"
    >
      <header className="flex items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-[81px] h-[81px] bg-[url(/898887d89ce7b428ae8824c896050271-2.png)] bg-[100%_100%]">
          <button
            className="relative top-[54px] left-[54px] w-6 flex"
            aria-label="Edit profile picture"
          >
            {/* <div className="w-6 h-6 flex bg-[#f8fafd] rounded-md border-[0.7px] border-solid border-[#2563eb0a]">
              <img
                className="mt-1.5 w-3 h-3 ml-1.5 aspect-[1]"
                alt=""
                src={pen1}
              />
            </div> */}
          </button>
        </div>

        <div className="flex flex-col items-start justify-between px-0 py-[5px] relative flex-1 self-stretch grow">
          <h1
            id="profile-heading"
            className="relative self-stretch mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#2a2a2a] text-2xl tracking-[0.48px] leading-[normal]"
          >
            Lucas Bennett
          </h1>

          <p className="relative self-stretch [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#949494] text-base tracking-[0.32px] leading-[normal]">
            Logistics Manager
          </p>

          <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
            {/* <img
              className="relative w-3 h-3 aspect-[1] object-cover"
              alt=""
              src={location11}
            /> */}

            <p className="relative w-[359px] mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#c7c7c7] text-sm tracking-[0.28px] leading-[normal]">
              Utrecht, Netherlands – 8:29 PM local time
            </p>
          </div>
        </div>
      </header>

      <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col w-[385px] items-start gap-2 relative">
          <label
            htmlFor="full-name"
            className="relative w-fit mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#4f4f4f] text-sm tracking-[0] leading-[18px] whitespace-nowrap"
          >
            Full Name
          </label>

          <input
            type="text"
            id="full-name"
            value={personalInfo.fullName}
            readOnly
            className="flex flex-col h-[38px] items-start justify-center gap-2.5 px-3 py-2 relative self-stretch w-full rounded-[7px] border border-solid border-[#c7c7c782] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#7b7b7b] text-base tracking-[0] leading-[18px]"
          />
        </div>

        <div className="flex flex-col w-[385px] items-start gap-2 relative">
          <label
            htmlFor="phone-number"
            className="relative w-fit mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#4f4f4f] text-sm tracking-[0] leading-[18px] whitespace-nowrap"
          >
            Phone Number
          </label>

          <input
            type="tel"
            id="phone-number"
            value={personalInfo.phoneNumber}
            readOnly
            className="flex flex-col h-[38px] items-start justify-center gap-2.5 px-3 py-2 relative self-stretch w-full rounded-[7px] border border-solid border-[#c7c7c782] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#7b7b7b] text-base tracking-[0] leading-[18px]"
          />
        </div>

        <div className="flex flex-col w-[385px] items-start gap-2 relative">
          <label
            htmlFor="email-address"
            className="relative w-fit mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#4f4f4f] text-sm tracking-[0] leading-[18px] whitespace-nowrap"
          >
            Email Address
          </label>

          <input
            type="email"
            id="email-address"
            value={personalInfo.emailAddress}
            readOnly
            className="flex flex-col h-[38px] items-start justify-center gap-2.5 px-3 py-2 relative self-stretch w-full rounded-[7px] border border-solid border-[#c7c7c782] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#7b7b7b] text-base tracking-[0] leading-[18px]"
          />
        </div>
      </div>

      <img
        className="relative self-stretch w-full h-px object-cover"
        alt=""
        src={vector159}
        role="presentation"
      />

      <div className="inline-flex flex-col items-start gap-5 relative flex-[0_0_auto]">
        <div className="relative w-[272px] h-[43px]">
          <h2 className="absolute top-0 left-0 [font-family:'Montserrat-Medium',Helvetica] font-medium text-black text-lg tracking-[0.36px] leading-[normal]">
            Company Information
          </h2>

          <p className="absolute top-7 left-0 [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#c7c7c7] text-xs tracking-[0.24px] leading-[normal]">
            Details used for policy and billing purposes
          </p>
        </div>

        <div className="inline-flex items-start gap-6 relative flex-[0_0_auto]">
          <div className="flex flex-col w-[385px] items-start gap-2 relative">
            <label
              htmlFor="company-name"
              className="relative w-fit mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#4f4f4f] text-sm tracking-[0] leading-[18px] whitespace-nowrap"
            >
              Company Name
            </label>

            <input
              type="text"
              id="company-name"
              value={companyInfo.companyName}
              readOnly
              className="flex flex-col h-[38px] items-start justify-center gap-2.5 px-3 py-2 relative self-stretch w-full rounded-[7px] border border-solid border-[#c7c7c782] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#7b7b7b] text-base tracking-[0] leading-[18px]"
            />
          </div>

          <div className="flex flex-col w-[385px] items-start gap-2 relative">
            <label
              htmlFor="company-address"
              className="relative w-fit mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#4f4f4f] text-sm tracking-[0] leading-[18px] whitespace-nowrap"
            >
              Company Address
            </label>

            <input
              type="text"
              id="company-address"
              value={companyInfo.companyAddress}
              readOnly
              className="flex flex-col h-[38px] items-start justify-center gap-2.5 px-3 py-2 relative self-stretch w-full rounded-[7px] border border-solid border-[#c7c7c782] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#7b7b7b] text-base tracking-[0] leading-[18px]"
            />
          </div>
        </div>
      </div>

      <img
        className="relative self-stretch w-full h-px object-cover"
        alt=""
        src={vector160}
        role="presentation"
      />

      <div className="inline-flex flex-col items-start gap-5 relative flex-[0_0_auto]">
        <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
          <div className="w-[278px] relative h-[43px]">
            <h2 className="absolute top-0 left-0 [font-family:'Montserrat-Medium',Helvetica] font-medium text-black text-lg tracking-[0.36px] leading-[normal]">
              Payment Methods
            </h2>

            <p className="absolute top-7 left-0 [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#c7c7c7] text-xs tracking-[0.24px] leading-[normal]">
              Add or remove payment methods for billing
            </p>
          </div>

          <button className="inline-flex h-[35.68px] items-center justify-center gap-2.5 px-3 py-1.5 relative flex-[0_0_auto] bg-blue-600 rounded-md">
            <span className="relative w-fit [font-family:'Poppins-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-[18px] whitespace-nowrap">
              Add Payment Method
            </span>
          </button>
        </div>

        <div className="inline-flex items-start gap-6 relative flex-[0_0_auto]">
          {paymentMethods.map((method) => (
            <article
              key={method.id}
              className="flex w-[385px] items-center justify-between p-3 relative rounded-[9px] border border-dashed border-[#e7e7eb]"
            >
              <div className="flex flex-col items-start gap-4 relative flex-1 grow">
                <div className="flex flex-col w-[172px] items-start gap-1.5 relative flex-[0_0_auto]">
                  <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                    <div className="flex flex-col w-[58px] h-[39px] items-start gap-2.5 relative">
                      <img
                        className="relative flex-1 self-stretch w-full grow"
                        alt="Card brand"
                        src={method.cardImage}
                      />
                    </div>

                    <div className="flex flex-col w-[102px] items-start justify-center relative">
                      <div className="relative w-[99px] h-[17px]">
                        <div className="absolute top-0 left-0 w-[211px] [font-family:'Urbanist-Medium',Helvetica] font-medium text-[#5e5e5e] text-sm tracking-[0] leading-[normal]">
                          {method.lastFourDigits}
                        </div>

                        {method.isDefault && (
                          <div className="inline-flex items-center justify-center gap-2.5 px-1 py-px absolute top-[calc(50.00%_-_6px)] left-[58px] bg-[#edecf7] rounded-[3px]">
                            <span className="relative w-fit mt-[-1.00px] [font-family:'Urbanist-Medium',Helvetica] font-medium text-[#7b7b7b] text-[8px] tracking-[0] leading-[normal]">
                              Default
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="relative w-[88px] [font-family:'Urbanist-Medium',Helvetica] font-medium text-[#7b7b7b] text-[10px] tracking-[0] leading-[normal]">
                        {method.expiryDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button aria-label="Remove payment method">
                <img
                  className="relative w-5 h-5 aspect-[1] object-cover"
                  alt=""
                  src={method.trashIcon}
                />
              </button>
            </article>
          ))}
        </div>
      </div>

      <img
        className="relative self-stretch w-full h-px object-cover"
        alt=""
        src={vector161}
        role="presentation"
      />

      <div className="w-[354px] relative h-[43px]">
        <h2 className="absolute top-0 left-0 [font-family:'Montserrat-Medium',Helvetica] font-medium text-black text-lg tracking-[0.36px] leading-[normal]">
          Billing History
        </h2>

        <p className="absolute top-7 left-0 [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#c7c7c7] text-xs tracking-[0.24px] leading-[normal]">
          View your policy premium payment history and invoices
        </p>
      </div>

      <div className="relative w-[1186px] h-[18px]" role="row">
        {tableHeaders.map((header, index) => (
          <div
            key={header.label}
            className="inline-flex items-center gap-2 absolute top-0"
            style={{ left: `${tableHeaderPositions[index]}px` }}
          >
            {header.icon && (
              <img
                className="relative w-px h-[10.5px] ml-[-0.50px]"
                alt=""
                src={header.icon}
              />
            )}

            <div
              className={`inline-flex items-center ${
                header.label === "Invoice" ? "gap-1.5" : "gap-[7px]"
              } relative flex-[0_0_auto]`}
            >
              <span className="relative w-fit mt-[-1.00px] [font-family:'Poppins-Regular',Helvetica] font-normal text-[#606068] text-sm tracking-[0] leading-[18px] whitespace-nowrap">
                {header.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col w-[1193px] items-start gap-2 relative flex-[0_0_auto] mb-[-16.00px]">
        <img
          className="relative w-[1193.5px] h-px mt-[-0.50px] mr-[-0.50px] object-cover"
          alt=""
          src={vector143}
          role="presentation"
        />

        {billingHistory.map((item, index) => (
          <div key={index}>
            <article className="relative w-[1193px] h-11 bg-[#f8fafd] rounded-md">
              <div className="flex w-[1173px] items-center justify-between relative top-1 left-3 bg-[#f8fafd]">
                <div className="relative w-fit [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-sm tracking-[0] leading-[18px] whitespace-nowrap">
                  {item.invoice}
                </div>

                <time className="relative w-fit [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-sm tracking-[0] leading-[18px] whitespace-nowrap">
                  {item.date}
                </time>

                <a
                  href={`#${item.policy}`}
                  className="relative w-[53px] h-[21px] [font-family:'Poppins-Regular',Helvetica] font-normal text-blue-600 text-sm tracking-[0] leading-[18px] underline whitespace-nowrap"
                >
                  {item.policy}
                </a>

                <div className="relative w-fit [font-family:'Poppins-Regular',Helvetica] font-normal text-[#030303] text-sm tracking-[0] leading-[18px] whitespace-nowrap">
                  {item.amount}
                </div>

                <div className="inline-flex items-center justify-center gap-1.5 px-0 py-0.5 relative flex-[0_0_auto] rounded-[37px]">
                  <div
                    className="relative w-1.5 h-1.5 rounded-[3px]"
                    style={{ backgroundColor: item.statusColor }}
                  />

                  <span
                    className="relative w-fit mt-[-1.00px] [font-family:'Poppins-Regular',Helvetica] font-normal text-xs tracking-[0] leading-[18px] whitespace-nowrap"
                    style={{ color: item.statusColor }}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
                  <button className="flex w-[130px] h-[35.68px] items-center justify-center gap-2.5 px-3 py-1.5 relative rounded-md border border-solid border-[#e3e6ea]">
                    <span className="relative w-fit [font-family:'Poppins-Regular',Helvetica] font-normal text-gray-700 text-sm tracking-[0] leading-[18px] whitespace-nowrap">
                      Download
                    </span>
                  </button>
                </div>
              </div>
            </article>

            <img
              className="relative w-[1193.5px] h-px mr-[-0.50px] object-cover"
              alt=""
              src={
                index === 0 ? vector144 : index === 1 ? vector145 : vector145
              }
              role="presentation"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
