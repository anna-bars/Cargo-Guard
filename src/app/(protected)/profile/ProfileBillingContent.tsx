export const ProfileBillingContent = () => {
  return (
    <div className="space-y-8">
      {/* Անձնական տեղեկատվություն */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Lucas Bennett</h2>
            <p className="text-gray-600 mt-1">Logistics Manager</p>
            <div className="flex items-center mt-4 text-gray-600">
              <span className="mr-2">📍</span>
              <span>Utrecht, Netherlands – 8:29 PM local time</span>
            </div>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-2 border border-[#0a3d62] text-[#0a3d62] rounded-lg hover:bg-[#0a3d62] hover:text-white transition-colors">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="p-3 bg-gray-50 rounded-lg">Lucas Bennett</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="p-3 bg-gray-50 rounded-lg">+1 (555) 123-4567</div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="p-3 bg-gray-50 rounded-lg">lucas.bennett@example.com</div>
          </div>
        </div>
      </div>

      {/* Կազմակերպության տեղեկատվություն */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
            <p className="text-gray-600 text-sm mt-1">Details used for policy and billing purposes</p>
          </div>
          <button className="px-4 py-2 text-[#0a3d62] hover:bg-gray-50 rounded-lg">
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <div className="p-3 bg-gray-50 rounded-lg">Anderson & Co.</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
            <div className="p-3 bg-gray-50 rounded-lg">123 Business Street, New York, NY 100001</div>
          </div>
        </div>
      </div>

      {/* Վճարման եղանակներ */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
            <p className="text-gray-600 text-sm mt-1">Add or remove payment methods for billing</p>
          </div>
          <button className="px-6 py-2 bg-[#0a3d62] text-white rounded-lg hover:bg-[#083354]">
            Add Payment Method
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Վճարման քարտի օրինակ */}
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-8 bg-gray-200 rounded mr-4"></div>
                <div>
                  <div className="font-medium">•••• 4242</div>
                  <div className="text-sm text-gray-600">Default • Expires 09/25</div>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-800 text-sm">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Բիլինգի պատմություն */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing History</h3>
        <p className="text-gray-600 mb-6">View your policy premium payment history and invoices</p>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Invoice</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Policy</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((item) => (
                <tr key={item} className="border-b border-gray-100">
                  <td className="py-4">INV-00{item}</td>
                  <td className="py-4 text-gray-600">Nov 1, 2025</td>
                  <td className="py-4 text-gray-600">P-0124</td>
                  <td className="py-4 font-medium">$1,245.00</td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Paid
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-[#0a3d62] hover:text-[#083354] font-medium">
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