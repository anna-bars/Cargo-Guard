export const ProfileBillingContent = () => {
  return (
    <div className="space-y-8">
      {/* Անձնական տեղեկատվություն */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 [font-family:'Montserrat-Regular',Helvetica]">
              Lucas Bennett
            </h2>
            <p className="text-gray-600 mt-1 [font-family:'Montserrat-Regular',Helvetica]">
              Logistics Manager
            </p>
            <div className="flex items-center mt-4 text-gray-600 [font-family:'Montserrat-Regular',Helvetica]">
              <span className="mr-2">📍</span>
              <span>Utrecht, Netherlands – 8:29 PM local time</span>
            </div>
          </div>
          <button className="px-6 py-2 border border-[#0a3d62] text-[#0a3d62] rounded-lg hover:bg-[#0a3d62] hover:text-white transition-colors [font-family:'Montserrat-Regular',Helvetica]">
            Edit Profile
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 [font-family:'Montserrat-Regular',Helvetica]">
              Full Name
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 [font-family:'Montserrat-Regular',Helvetica] text-gray-800">
              Lucas Bennett
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 [font-family:'Montserrat-Regular',Helvetica]">
              Phone Number
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 [font-family:'Montserrat-Regular',Helvetica] text-gray-800">
              +1 (555) 123-4567
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 [font-family:'Montserrat-Regular',Helvetica]">
              Email Address
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 [font-family:'Montserrat-Regular',Helvetica] text-gray-800">
              lucas.bennett@example.com
            </div>
          </div>
        </div>
      </div>

      {/* Կազմակերպության տեղեկատվություն */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 [font-family:'Montserrat-Regular',Helvetica]">
              Company Information
            </h3>
            <p className="text-gray-600 text-sm mt-1 [font-family:'Montserrat-Regular',Helvetica]">
              Details used for policy and billing purposes
            </p>
          </div>
          <button className="px-4 py-2 text-[#0a3d62] hover:bg-gray-50 rounded-lg [font-family:'Montserrat-Regular',Helvetica]">
            Edit
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 [font-family:'Montserrat-Regular',Helvetica]">
              Company Name
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 [font-family:'Montserrat-Regular',Helvetica] text-gray-800">
              Anderson & Co.
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 [font-family:'Montserrat-Regular',Helvetica]">
              Company Address
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 [font-family:'Montserrat-Regular',Helvetica] text-gray-800">
              123 Business Street, New York, NY 100001
            </div>
          </div>
        </div>
      </div>

      {/* Վճարման եղանակներ */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 [font-family:'Montserrat-Regular',Helvetica]">
              Payment Methods
            </h3>
            <p className="text-gray-600 text-sm mt-1 [font-family:'Montserrat-Regular',Helvetica]">
              Add or remove payment methods for billing
            </p>
          </div>
          <button className="px-6 py-2 bg-[#0a3d62] text-white rounded-lg hover:bg-[#083354] transition-colors [font-family:'Montserrat-Regular',Helvetica]">
            Add Payment Method
          </button>
        </div>
        
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="w-12 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded mr-4 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">VISA</span>
                </div>
                <div>
                  <div className="font-medium [font-family:'Montserrat-Regular',Helvetica]">
                    •••• 4242
                  </div>
                  <div className="text-sm text-gray-600 [font-family:'Montserrat-Regular',Helvetica]">
                    Default • Expires 09/25
                  </div>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-800 text-sm [font-family:'Montserrat-Regular',Helvetica] px-3 py-1 hover:bg-red-50 rounded">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Բիլինգի պատմություն */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 [font-family:'Montserrat-Regular',Helvetica]">
          Billing History
        </h3>
        <p className="text-gray-600 mb-6 [font-family:'Montserrat-Regular',Helvetica]">
          View your policy premium payment history and invoices
        </p>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700 [font-family:'Montserrat-Regular',Helvetica] border-b border-gray-200">
                  Invoice
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700 [font-family:'Montserrat-Regular',Helvetica] border-b border-gray-200">
                  Date
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700 [font-family:'Montserrat-Regular',Helvetica] border-b border-gray-200">
                  Policy
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700 [font-family:'Montserrat-Regular',Helvetica] border-b border-gray-200">
                  Amount
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700 [font-family:'Montserrat-Regular',Helvetica] border-b border-gray-200">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-700 [font-family:'Montserrat-Regular',Helvetica] border-b border-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((item) => (
                <tr key={item} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 [font-family:'Montserrat-Regular',Helvetica] font-medium border-b border-gray-100">
                    INV-00{item}
                  </td>
                  <td className="py-4 px-4 text-gray-600 [font-family:'Montserrat-Regular',Helvetica] border-b border-gray-100">
                    Nov 1, 2025
                  </td>
                  <td className="py-4 px-4 text-gray-600 [font-family:'Montserrat-Regular',Helvetica] border-b border-gray-100">
                    P-0124
                  </td>
                  <td className="py-4 px-4 font-medium [font-family:'Montserrat-Regular',Helvetica] border-b border-gray-100">
                    $1,245.00
                  </td>
                  <td className="py-4 px-4 border-b border-gray-100">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs [font-family:'Montserrat-Regular',Helvetica]">
                      Paid
                    </span>
                  </td>
                  <td className="py-4 px-4 border-b border-gray-100">
                    <button className="text-[#0a3d62] hover:text-[#083354] font-medium [font-family:'Montserrat-Regular',Helvetica] flex items-center gap-1">
                      <span>📥</span>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}