import { useState } from "react";

export const ProfileBillingContent = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      cardImage: "group-1000003081.png",
      lastFourDigits: "4242",
      isDefault: true,
      expiryDate: "09/25",
      deleteIcon: "trash-1.png",
    },
    {
      id: "2",
      cardImage: "group-1000003081-2.png",
      lastFourDigits: "4242",
      isDefault: true,
      expiryDate: "09/25",
      deleteIcon: "image.png",
    },
  ]);

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

  const billingHistoryData = [
    {
      id: "1",
      invoiceNumber: "INV-001",
      date: "Nov 1, 2025",
      projectId: "P-0124",
      amount: "$1,245.00",
      status: "Paid",
      statusColor: "#cbd03c",
    },
    {
      id: "2",
      invoiceNumber: "INV-002",
      date: "Nov 1, 2025",
      projectId: "P-0124",
      amount: "$1,245.00",
      status: "Paid",
      statusColor: "#cbd03c",
    },
    {
      id: "3",
      invoiceNumber: "INV-003",
      date: "Nov 1, 2025",
      projectId: "P-0124",
      amount: "$1,245.00",
      status: "Paid",
      statusColor: "#cbd03c",
    },
  ];

  return (
    <div className="flex flex-col w-[1250px] items-start gap-6 p-6 relative bg-[#fafcffcc] rounded-2xl">
      {/* User Profile Section */}
      <div className="flex items-start gap-4 relative self-stretch w-full">
        <img
          className="relative w-[81px] h-[81px]"
          alt="Lucas Bennett profile picture"
          src="group-211.svg"
        />
        <div className="flex flex-col items-start justify-between px-0 py-[5px] relative flex-1 self-stretch grow">
          <h1 className="relative self-stretch mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#2a2a2a] text-2xl tracking-[0.48px] leading-[normal]">
            Lucas Bennett
          </h1>
          <p className="relative self-stretch [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#949494] text-base tracking-[0.32px] leading-[normal]">
            Logistics Manager
          </p>
          <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
            <img
              className="relative w-3 h-3 aspect-[1] object-cover"
              alt="Location icon"
              src="location-1-1.png"
            />
            <p className="relative w-[359px] mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#c7c7c7] text-sm tracking-[0.28px] leading-[normal]">
              Utrecht, Netherlands – 8:29 PM local time
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information Fields */}
      <div className="flex items-start justify-between relative self-stretch w-full">
        {[
          { id: "fullName", label: "Full Name", value: "Lucas Bennett" },
          { id: "phoneNumber", label: "Phone Number", value: "+1 (555) 123-4567" },
          { id: "emailAddress", label: "Email Address", value: "lucas.bennett@example.com" },
        ].map((field) => (
          <div key={field.id} className="flex flex-col w-[385px] items-start gap-2 relative">
            <label className="relative w-fit mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#4f4f4f] text-sm tracking-[0] leading-[18px] whitespace-nowrap">
              {field.label}
            </label>
            <div className="flex flex-col h-[38px] items-start justify-center gap-2.5 px-3 py-2 relative self-stretch w-full rounded-[7px] border border-solid border-[#c7c7c782]">
              <div className="relative w-full mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#7b7b7b] text-base tracking-[0] leading-[18px] whitespace-nowrap">
                {field.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative self-stretch w-full h-px bg-gray-200" />

      {/* Company Information */}
      <div className="inline-flex flex-col items-start gap-5 relative">
        <div className="relative w-[272px] h-[43px]">
          <h2 className="absolute top-0 left-0 [font-family:'Montserrat-Medium',Helvetica] font-medium text-black text-lg tracking-[0.36px] leading-[normal]">
            Company Information
          </h2>
          <p className="absolute top-7 left-0 [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#c7c7c7] text-xs tracking-[0.24px] leading-[normal]">
            Details used for policy and billing purposes
          </p>
        </div>
        <div className="inline-flex items-start gap-6 relative">
          {[
            { id: "companyName", label: "Company Name", value: "Anderson & Co." },
            { id: "companyAddress", label: "Company Address", value: "123 Business Street, New York, NY 100001" },
          ].map((field) => (
            <div key={field.id} className="flex flex-col w-[385px] items-start gap-2 relative">
              <label className="relative w-fit mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#4f4f4f] text-sm tracking-[0] leading-[18px] whitespace-nowrap">
                {field.label}
              </label>
              <div className="flex flex-col h-[38px] items-start justify-center gap-2.5 px-3 py-2 relative self-stretch w-full rounded-[7px] border border-solid border-[#c7c7c782]">
                <div className="relative w-full mt-[-1.00px] [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#7b7b7b] text-base tracking-[0] leading-[18px] whitespace-nowrap">
                  {field.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative self-stretch w-full h-px bg-gray-200" />

      {/* Payment Methods */}
      <div className="inline-flex flex-col items-start gap-5 relative">
        <div className="flex items-start justify-between relative self-stretch w-full">
          <div className="w-[278px] relative h-[43px]">
            <h2 className="absolute top-0 left-0 [font-family:'Montserrat-Medium',Helvetica] font-medium text-black text-lg tracking-[0.36px] leading-[normal]">
              Payment Methods
            </h2>
            <p className="absolute top-7 left-0 [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#c7c7c7] text-xs tracking-[0.24px] leading-[normal]">
              Add or remove payment methods for billing
            </p>
          </div>
          <button className="inline-flex h-[35.68px] items-center justify-center gap-2.5 px-3 py-1.5 relative bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            <span className="relative w-fit [font-family:'Poppins-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-[18px] whitespace-nowrap">
              Add Payment Method
            </span>
          </button>
        </div>
        <div className="inline-flex items-start gap-6 relative">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex w-[385px] items-center justify-between p-3 relative rounded-[9px] border border-dashed border-[#e7e7eb]">
              <div className="flex flex-col items-start gap-4 relative flex-1 grow">
                <div className="flex flex-col w-[172px] items-start gap-1.5 relative">
                  <div className="inline-flex items-center gap-3 relative">
                    <div className="flex flex-col w-[58px] h-[39px] items-start gap-2.5 relative">
                      <div className="relative flex-1 self-stretch w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
                    </div>
                    <div className="flex flex-col w-[102px] items-start justify-center relative">
                      <div className="relative w-[99px] h-[17px]">
                        <div className="absolute top-0 left-0 [font-family:'Urbanist-Medium',Helvetica] font-medium text-[#5e5e5e] text-sm tracking-[0]">
                          •••• {method.lastFourDigits}
                        </div>
                        {method.isDefault && (
                          <span className="inline-flex items-center justify-center gap-2.5 px-1 py-px absolute left-[58px] bg-[#edecf7] rounded-[3px]">
                            <span className="relative w-fit mt-[-1.00px] [font-family:'Urbanist-Medium',Helvetica] font-medium text-[#7b7b7b] text-[8px] tracking-[0]">
                              Default
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="relative [font-family:'Urbanist-Medium',Helvetica] font-medium text-[#7b7b7b] text-[10px] tracking-[0]">
                        Expires {method.expiryDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeletePaymentMethod(method.id)}
                className="relative w-5 h-5 aspect-[1] hover:opacity-70 transition-opacity"
              >
                <div className="w-full h-full bg-red-500 rounded-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="relative self-stretch w-full h-px bg-gray-200" />

      {/* Billing History Header */}
      <div className="w-[354px] relative h-[43px]">
        <h1 className="absolute top-0 left-0 [font-family:'Montserrat-Medium',Helvetica] font-medium text-black text-lg tracking-[0.36px] leading-[normal]">
          Billing History
        </h1>
        <p className="absolute top-7 left-0 [font-family:'Montserrat-Regular',Helvetica] font-normal text-[#c7c7c7] text-xs tracking-[0.24px] leading-[normal]">
          View your policy premium payment history and invoices
        </p>
      </div>

      {/* Billing History Table Header */}
      <div className="relative w-[1186px] h-[18px]">
        {[
          { label: "Invoice", left: 0 },
          { label: "Date", left: 209 },
          { label: "Policy", left: 436 },
          { label: "Amount", left: 641 },
          { label: "Status", left: 855 },
          { label: "Action", left: 1133 },
        ].map((column, index) => (
          <div key={index} className="inline-flex items-center gap-2 absolute top-0" style={{ left: `${column.left}px` }}>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins-Regular',Helvetica] font-normal text-[#606068] text-sm tracking-[0] leading-[18px] whitespace-nowrap">
              {column.label}
            </div>
          </div>
        ))}
      </div>

      {/* Billing History Items */}
      <div className="flex flex-col w-[1193px] items-start gap-2 relative">
        {billingHistoryData.map((item) => (
          <div key={item.id} className="border-t border-[#EFF1F3] pt-1 relative w-[1193px] h-11 bg-[#f8fafd] rounded-md">
            <div className="flex w-[1173px] items-center justify-between relative top-1 left-3">
              <div className="relative w-fit [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-sm tracking-[0] leading-[18px] whitespace-nowrap">
                {item.invoiceNumber}
              </div>
              <div className="relative w-fit [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-sm tracking-[0] leading-[18px] whitespace-nowrap">
                {item.date}
              </div>
              <div className="relative w-[53px] h-[21px] [font-family:'Poppins-Regular',Helvetica] font-normal text-blue-600 text-sm tracking-[0] leading-[18px] underline whitespace-nowrap">
                {item.projectId}
              </div>
              <div className="relative w-fit [font-family:'Poppins-Regular',Helvetica] font-normal text-[#030303] text-sm tracking-[0] leading-[18px] whitespace-nowrap">
                {item.amount}
              </div>
              <div className="inline-flex items-center justify-center gap-1.5 px-0 py-0.5 relative rounded-[37px]">
                <div className="relative w-1.5 h-1.5 rounded-[3px]" style={{ backgroundColor: item.statusColor }} />
                <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins-Regular',Helvetica] font-normal text-xs tracking-[0] leading-[18px] whitespace-nowrap" style={{ color: item.statusColor }}>
                  {item.status}
                </div>
              </div>
              <button className="flex w-[130px] h-[35.68px] items-center justify-center gap-2.5 px-3 py-1.5 relative rounded-md border border-solid border-[#e3e6ea] hover:bg-gray-50 transition-colors">
                <span className="relative w-fit [font-family:'Poppins-Regular',Helvetica] font-normal text-gray-700 text-sm tracking-[0] leading-[18px] whitespace-nowrap">
                  Download
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};