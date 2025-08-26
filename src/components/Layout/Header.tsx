import React, { useState } from 'react'
import { Bell, Search, Settings, LogOut, Menu, X } from 'lucide-react'
import { Button } from '../ui/button'

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  searchTerm = '', 
  onSearchChange 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const user = {
    name: 'John Doe',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  }

  const handleLogoClick = () => {
    window.location.reload() // Simple home navigation
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Clear any stored data
      localStorage.clear()
      alert('Logged out successfully!')
      window.location.reload()
    }
  }

  const handleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const handleSettings = () => {
    alert('Settings panel would open here - integrated with dashboard settings!')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Clickable */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FP</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FlowPay
              </h1>
            </button>
          </div>

          {/* Desktop Search - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search expenses, vendors, or categories..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Right side - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={handleNotifications}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-12 right-20 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64 z-50">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <div className="space-y-2 text-sm">
                  <p>• 2 expenses pending approval</p>
                  <p>• Budget limit approaching</p>
                  <p>• New team member added</p>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-blue-600 text-xs mt-2"
                >
                  Close
                </button>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSettings}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* User Avatar - Clickable */}
            <button className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
              />
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </button>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile User Avatar and Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
            />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Shown when open */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            {/* Mobile Search */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder="Search expenses, vendors, or categories..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange?.('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div className="px-4 pb-4 space-y-3">
              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col items-center gap-1 h-auto py-3 relative"
                  onClick={handleNotifications}
                >
                  <Bell className="w-4 h-4" />
                  <span className="text-xs">Notifications</span>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={handleSettings}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-xs">Settings</span>
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}