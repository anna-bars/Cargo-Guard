import DashboardHeader from '@/app/components/dashboard/DashboardHeader'

export default function ShippingValuePage() {
  return (
    <div className="min-h-screen bg-[#F3F3F6]">
      <DashboardHeader userEmail={"c"} />
      
      {/* Page Header */}
      <div className="px-6">
        <div className="flex items-center gap-3 mt-4 mb-2 sm:mt-0">
          <img
            src="/quotes/header-ic.svg"
            alt="Quote Icon"
            className="w-[22px] h-[22px] sm:w-6 sm:h-6"
          />
          <h2 className="font-normal text-[18px] sm:text-[26px]">
            Shipment Insurance Quote
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        <div className="flex gap-6">
          {/* Left Column - Form */}
          <div className="w-[1241px] flex flex-col gap-[44px] bg-[#fafcff] p-6 rounded-2xl">
            <div className="flex flex-col gap-[44px]">
              {/* Cargo Type */}
              <div className="w-[585px] flex flex-col gap-2">
                <span className="font-normal text-[14px] leading-[18px] text-[#505050]">
                  Cargo Type
                </span>
                <div className="flex flex-col justify-between self-stretch h-[42px] px-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8]">
                  <div className="flex justify-between items-center self-stretch">
                    <span className="font-normal text-[16px] leading-[18px] text-[#7b7b7b]">
                      Select cargo type
                    </span>
                    <div className="w-2 h-[5px]">
                      <svg className="w-[7.363962173461914px] h-[4.181982517242432px] text-[#7b7b7b]"></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipment Value */}
              <div className="w-[585px] flex flex-col gap-2">
                <span className="font-normal text-[14px] leading-[18px] text-[#505050]">
                  Shipment Value
                </span>
                <div className="flex flex-col justify-between self-stretch h-[42px] px-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8]">
                  <div className="flex items-center gap-3">
                    <span className="font-normal text-[16px] leading-[18px] text-[#7b7b7b]">
                      $
                    </span>
                    <span className="font-normal text-[16px] leading-[18px] text-[#7b7b7b]">
                      Enter total shipment value (USD)
                    </span>
                  </div>
                </div>
              </div>

              {/* Origin and Destination */}
              <div className="flex justify-between items-center self-stretch">
                {/* Origin */}
                <div className="w-[585px] flex flex-col gap-2">
                  <span className="font-normal text-[14px] leading-[18px] text-[#505050]">
                    From (Origin City / Port)
                  </span>
                  <div className="flex flex-col justify-between self-stretch h-[42px] px-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8]">
                    <div className="flex items-center gap-3">
                      <img className="w-3 h-4" alt="" />
                      <span className="font-normal text-[14px] leading-[18px] text-[#505050]">
                        From (Origin City / Port)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div className="w-[585px] flex flex-col gap-2">
                  <span className="font-normal text-[14px] leading-[18px] text-[#505050]">
                    To (Destination City / Port)
                  </span>
                  <div className="flex flex-col justify-between self-stretch h-[42px] px-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8]">
                    <div className="flex items-center gap-3">
                      <img className="w-3 h-4" alt="" />
                      <span className="font-normal text-[14px] leading-[18px] text-[#505050]">
                        To (Destination City / Port)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coverage Period */}
              <div className="flex justify-between items-end self-stretch">
                {/* Start Date */}
                <div className="w-[585px] flex flex-col gap-2">
                  <span className="font-normal text-[14px] leading-[18px] text-[#505050]">
                    Coverage Period
                  </span>
                  <div className="flex flex-col justify-between self-stretch h-[42px] px-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8]">
                    <div className="flex items-center gap-3">
                      <img className="w-4 h-4" alt="" />
                      <span className="font-normal text-[14px] leading-[18px] text-[#505050]">
                        dd.mm.yyyy
                      </span>
                    </div>
                  </div>
                </div>

                {/* End Date */}
                <div className="w-[585px] flex flex-col gap-2">
                  <div className="flex flex-col justify-between self-stretch h-[42px] px-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8]">
                    <div className="flex items-center gap-3">
                      <img className="w-4 h-4" alt="" />
                      <span className="font-normal text-[14px] leading-[18px] text-[#505050]">
                        dd.mm.yyyy
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transportation Mode */}
              <div className="flex flex-col justify-between self-stretch h-[118px]">
                <span className="font-normal text-[14px] leading-[18px] text-[#505050]">
                  Transportation Mode
                </span>
                <div className="flex justify-between items-center self-stretch">
                  {/* Sea */}
                  <div className="w-[383px] flex flex-col justify-center items-center gap-[3px] px-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8]">
                    <img className="w-12 h-12 object-cover" alt="Sea" />
                    <span className="font-normal text-[14px] leading-[18px] text-center text-[#505050]">
                      Sea
                    </span>
                  </div>

                  {/* Air */}
                  <div className="w-[383px] flex flex-col justify-center items-center gap-[3px] px-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8]">
                    <img className="w-12 h-12" alt="Air" />
                    <span className="font-normal text-[14px] leading-[18px] text-center text-[#505050]">
                      Air
                    </span>
                  </div>

                  {/* Road */}
                  <div className="w-[383px] flex flex-col justify-center items-center gap-[3px] px-4 py-3 rounded-[7px] border border-solid border-[#c8c8c8]">
                    <img className="w-[51px] h-12" alt="Road" />
                    <span className="font-normal text-[14px] leading-[18px] text-center text-[#505050]">
                      Road
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button className="flex justify-center items-center gap-2.5 px-4 py-3 rounded-md border border-solid border-[#c6c8cb] hover:bg-gray-50 transition-colors">
                <span className="font-normal text-[16px] leading-[18px] text-gray-700">
                  Cancel
                </span>
              </button>
              <button className="flex justify-center items-center gap-2.5 bg-blue-600 px-4 py-3 rounded-md hover:bg-blue-700 transition-colors">
                <span className="font-normal text-[16px] leading-[18px] text-white">
                  Calculate Quote
                </span>
              </button>
            </div>
          </div>

          {/* Right Column - Tips */}
          <div className="flex flex-col gap-[76px] p-6 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-800">
            <span className="font-normal text-[20px] text-white">
              Smart Quote Tips
            </span>
            
            <div className="flex flex-col gap-1.5 self-stretch">
              <div className="self-stretch h-[51px] flex items-start gap-2">
                <img className="w-3 h-3 object-cover mt-1" alt="Tip" />
                <span className="text-[14px] text-white">
                  Full Coverage: Ensure your Shipment Value includes all freight and duties to guarantee full coverage.
                </span>
              </div>
              <div className="self-stretch h-[34px] flex items-start gap-2">
                <img className="w-3 h-3 object-cover mt-1" alt="Tip" />
                <span className="text-[14px] text-white">
                  Lower Premiums: Selecting the correct Cargo Type can significantly reduce your premium.
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-[13px] self-stretch">
              <span className="font-bold text-[12px] leading-3 text-right text-white">
                1 of 6
              </span>
              <span className="font-normal text-[10px] leading-3 text-white">
                Complete 6 more fields to continue.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}