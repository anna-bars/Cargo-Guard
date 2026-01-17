import ShippingValueInput from '@/app/components/quotes/ShippingValueInput'

export default function ShippingValuePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
         <div className="flex items-center gap-3 mt-4 mb-2 sm:mt-0">
                  <img
                    src="/quotes/header-ic.svg"
                    alt=""
                    className="w-[22px] h-[22px] sm:w-6 sm:h-6"
                  />
                  <h2 className="font-normal text-[18px] sm:text-[26px]">Shipment Insurance Quote</h2>
                   
                </div> 
      <ShippingValueInput />
    </div>
  )
}