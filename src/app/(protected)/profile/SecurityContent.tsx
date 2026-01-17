export const SecurityContent = () => {
  return (
    <div className="space-y-8">
      {/* Գաղտնաբառի փոփոխություն */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 [font-family:'Montserrat-Regular',Helvetica]">
              Change Password
            </h3>
            <p className="text-gray-600 text-sm mt-1 [font-family:'Montserrat-Regular',Helvetica]">
              Update your password regularly to keep your account secure
            </p>
          </div>
          <button className="px-6 py-2 bg-[#0a3d62] text-white rounded-lg hover:bg-[#083354] transition-colors [font-family:'Montserrat-Regular',Helvetica]">
            Change Password
          </button>
        </div>
        
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 [font-family:'Montserrat-Regular',Helvetica]">
              Current Password
            </label>
            <input 
              type="password" 
              className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 [font-family:'Montserrat-Regular',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#0a3d62] focus:border-transparent"
              placeholder="Enter current password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 [font-family:'Montserrat-Regular',Helvetica]">
              New Password
            </label>
            <input 
              type="password" 
              className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 [font-family:'Montserrat-Regular',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#0a3d62] focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 [font-family:'Montserrat-Regular',Helvetica]">
              Confirm New Password
            </label>
            <input 
              type="password" 
              className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 [font-family:'Montserrat-Regular',Helvetica] focus:outline-none focus:ring-2 focus:ring-[#0a3d62] focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>

      {/* Երկփուլ մուտքի հաստատում */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 [font-family:'Montserrat-Regular',Helvetica]">
              Two-Factor Authentication
            </h3>
            <p className="text-gray-600 text-sm mt-1 [font-family:'Montserrat-Regular',Helvetica]">
              Add an extra layer of security to your account
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 [font-family:'Montserrat-Regular',Helvetica]">
              Enabled
            </span>
            <div className="relative">
              <input type="checkbox" id="2fa-toggle" className="sr-only" />
              <label 
                htmlFor="2fa-toggle"
                className="block w-12 h-6 bg-[#0a3d62] rounded-full cursor-pointer relative"
              >
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700 [font-family:'Montserrat-Regular',Helvetica]">
            ⚡ Two-factor authentication is currently active. You'll need to verify your identity using your authenticator app when signing in from new devices.
          </p>
        </div>
      </div>

      {/* Ակտիվ սեսիաներ */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 [font-family:'Montserrat-Regular',Helvetica]">
              Active Sessions
            </h3>
            <p className="text-gray-600 text-sm mt-1 [font-family:'Montserrat-Regular',Helvetica]">
              Manage your login sessions across devices
            </p>
          </div>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm [font-family:'Montserrat-Regular',Helvetica]">
            Sign Out All Devices
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600">🌐</span>
                </div>
                <div>
                  <div className="font-medium [font-family:'Montserrat-Regular',Helvetica]">
                    Chrome on Windows
                  </div>
                  <div className="text-sm text-gray-600 [font-family:'Montserrat-Regular',Helvetica]">
                    Gyumri, Armenia – Last active: 5 minutes ago
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs [font-family:'Montserrat-Regular',Helvetica]">
                  Current
                </span>
                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm [font-family:'Montserrat-Regular',Helvetica]">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 opacity-70">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-gray-400">📱</span>
              </div>
              <div>
                <div className="font-medium [font-family:'Montserrat-Regular',Helvetica] text-gray-500">
                  Safari on iPhone
                </div>
                <div className="text-sm text-gray-400 [font-family:'Montserrat-Regular',Helvetica]">
                  Amsterdam, Netherlands – Last active: 2 days ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Հաշիվը հեռացնելը */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-red-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-red-900 [font-family:'Montserrat-Regular',Helvetica]">
              Delete Account
            </h3>
            <p className="text-red-600 text-sm mt-1 [font-family:'Montserrat-Regular',Helvetica]">
              Permanently delete your account and all data. This action cannot be undone.
            </p>
          </div>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors [font-family:'Montserrat-Regular',Helvetica]">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}