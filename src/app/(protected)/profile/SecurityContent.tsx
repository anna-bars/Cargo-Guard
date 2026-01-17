export const SecurityContent = () => {
  return (
    <div className="space-y-8">
      {/* Գաղտնաբառի փոփոխություն */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
            <p className="text-gray-600 text-sm mt-1">Update your password regularly to keep your account secure</p>
          </div>
          <button className="px-6 py-2 border border-[#0a3d62] text-[#0a3d62] rounded-lg hover:bg-[#0a3d62] hover:text-white transition-colors">
            Change Password
          </button>
        </div>
      </div>

      {/* Երկփուլ մուտքի հաստատում */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
            <p className="text-gray-600 text-sm mt-1">Add an extra layer of security to your account</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Enable</span>
            <button className="w-12 h-6 bg-[#0a3d62] rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Ակտիվ սեսիաներ */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
            <p className="text-gray-600 text-sm mt-1">Manage your login sessions across devices</p>
          </div>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">
            View All
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-gray-600">🌐</span>
              </div>
              <div>
                <div className="font-medium">Chrome on Windows</div>
                <div className="text-sm text-gray-600">Gyumri, Armenia • Last active: 5 minutes ago</div>
              </div>
            </div>
            <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Հաշիվը հեռացնելը */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-red-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-red-900">Delete Account</h3>
            <p className="text-red-600 text-sm mt-1">Permanently delete your account and all data</p>
          </div>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}