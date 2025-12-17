import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navbar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cargo Guard</h1>
            <p className="text-gray-600">Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.email}</span>
            <LogoutButton />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome back, {user.email}!</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Simple Stats */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700">Total Quotes</h3>
              <p className="text-3xl font-bold mt-2">0</p>
              <p className="text-sm text-gray-500">No quotes created yet</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700">Active Policies</h3>
              <p className="text-3xl font-bold mt-2">0</p>
              <p className="text-sm text-gray-500">No active policies</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-700">Pending Documents</h3>
              <p className="text-3xl font-bold mt-2">0</p>
              <p className="text-sm text-gray-500">All documents uploaded</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Create New Quote
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition">
                View Policies
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition">
                Upload Documents
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-bold mb-2">Your Account Info</h4>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id.substring(0, 8)}...</p>
            <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}