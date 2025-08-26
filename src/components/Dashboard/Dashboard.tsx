import React from 'react'
import { useState } from 'react'
import { ChatInterface } from '../AI/ChatInterface'
import { Button } from '../ui/button'
import { Web3Payments } from './Web3Payments'
import { useExpenseManagement, type NewExpenseData } from '@/hooks/useExpenseManagement'
import { useToast } from '@/hooks/use-toast'
import { AnalyticsModal } from '@/components/Analytics/AnalyticsModal'
import { EditExpenseModal } from '@/components/Expense/EditExpenseModal'
import { DataManagementModal } from '@/components/Settings/DataManagementModal'
import { Plus, BarChart3, Settings, X, Edit, Trash2, MoreVertical, Search, Download } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDataManagement, setShowDataManagement] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expenseFormData, setExpenseFormData] = useState({
    vendor: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false)
  
  const { 
    expenses, 
    addExpense, 
    updateExpense, 
    removeExpense, 
    getExpenseStats, 
    getRecentExpenses,
    clearAllExpenses,
    resetToDefaults,
    exportExpensesData,
    importExpensesData
  } = useExpenseManagement()
  const { toast } = useToast()
  
  const stats = getExpenseStats()
  const recentExpenses = getRecentExpenses(5)

  // Filter expenses based on search and status
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = searchTerm === '' || 
      expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.employee.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleExpenseSubmit = async () => {
    if (!expenseFormData.vendor || !expenseFormData.amount || !expenseFormData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsSubmittingExpense(true)
    try {
      const newExpenseData: NewExpenseData = {
        vendor: expenseFormData.vendor,
        amount: parseFloat(expenseFormData.amount),
        category: expenseFormData.category,
        description: expenseFormData.description,
        date: expenseFormData.date
      }

      await addExpense(newExpenseData)
      
      toast({
        title: "Expense Added Successfully! 🎉",
        description: `${expenseFormData.vendor} - $${expenseFormData.amount} has been submitted for approval.`,
      })

      // Reset form
      setExpenseFormData({
        vendor: '',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
      setShowExpenseForm(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmittingExpense(false)
    }
  }

  const handleAnalyticsClick = () => {
    setShowAnalytics(true)
  }

  const handleRemoveExpense = (expenseId: number, expenseDescription: string) => {
    removeExpense(expenseId)
    toast({
      title: "Expense Removed",
      description: `"${expenseDescription}" has been deleted successfully.`,
    })
  }

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense)
    setShowEditModal(true)
  }

  const handleSaveExpense = (id: number, updatedExpense: any) => {
    updateExpense(id, updatedExpense)
    setShowEditModal(false)
    setEditingExpense(null)
  }

  const handleExport = () => {
    const csvHeaders = ['Date', 'Vendor', 'Category', 'Amount', 'Status', 'Submitted By', 'Description']
    const csvData = filteredExpenses.map(expense => [
      new Date(expense.date).toLocaleDateString(),
      expense.vendor,
      expense.category,
      `$${expense.amount.toFixed(2)}`,
      expense.status,
      expense.employee,
      expense.description
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete! 📥",
      description: `Exported ${filteredExpenses.length} expenses to CSV file.`,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your expenses today.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <Button
            onClick={() => setShowExpenseForm(true)}
            className="shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Expense
          </Button>
          <Button 
            variant="outline"
            onClick={handleAnalyticsClick}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowDataManagement(true)}
            title="Data Management"
            className="self-center sm:self-auto"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'optimizer', label: 'Budget Optimizer', icon: Settings },
              { id: 'web3', label: 'Web3 Payments', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Grid - Responsive layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Monthly Budget Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Monthly Budget</h3>
                <span className="text-xs text-gray-400">$</span>
              </div>
              <div className="mb-4">
                <p className="text-2xl font-bold text-gray-900">$45,000.00</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Spent</span>
                  <span className="font-medium">$32,150.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-medium text-green-600">$12,850.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">71.4%</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-400 h-2 rounded-full" style={{width: '71.4%'}}></div>
                </div>
                <p className="text-xs text-orange-600 mt-1">⚠️ High spending rate</p>
              </div>
            </div>

            {/* Pending Approvals Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">{stats.pending} pending</span>
              </div>
              <div className="space-y-3">
                {recentExpenses.filter(e => e.status === 'pending').slice(0, 3).map((expense, index) => (
                  <div key={expense.id} className={`${index < 2 ? 'border-b border-gray-100 pb-3' : 'pb-3'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <p className="text-xs text-gray-500">by {expense.employee} • {new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                      <span className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                {stats.pending === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No pending approvals</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  setStatusFilter('pending')
                  setActiveTab('overview')
                  // Scroll to the table section
                  setTimeout(() => {
                    const tableElement = document.querySelector('[data-table="expenses"]')
                    if (tableElement) {
                      tableElement.scrollIntoView({ behavior: 'smooth' })
                    }
                  }, 100)
                }}
                className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                👁️ View All Pending
              </button>
            </div>

            {/* AI Insights & Web3 Combined Card */}
            <div className="space-y-6">
              {/* AI Insights */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">AI Insights</h3>
                  <span className="text-purple-600">🔮</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Budget Alert</p>
                      <p className="text-xs text-gray-500">You're 71% through your monthly budget with 5 days remaining.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Unusual Expenses Detected</p>
                      <p className="text-xs text-gray-500">Conference expenses 40% higher than usual.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cost Optimization</p>
                      <p className="text-xs text-gray-500">Consider consolidating 3 similar software subscriptions.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Web3 Payments */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Web3 Payments</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Multi-chain Ready</span>
                    <span className="text-sm font-medium">Ethereum + Polygon</span>
                  </div>
                  <div className="border-t pt-3">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">AVAILABLE TOKENS</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">USDC</span>
                        </div>
                        <span className="text-sm font-medium">12,450.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">DAI</span>
                        </div>
                        <span className="text-sm font-medium">8,220.50</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span className="text-sm">USDT</span>
                        </div>
                        <span className="text-sm font-medium">5,678.26</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                          <span className="text-sm">ETH</span>
                        </div>
                        <span className="text-sm font-medium">2.45</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="text-xs text-gray-500">Latest Transaction</div>
                    <div className="text-sm font-medium">0x742d35...cc6318</div>
                    <div className="text-xs text-green-600">Confirmed • 4 minutes ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Expenses Table */}
          <div data-table="expenses" className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search expenses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged</option>
                  </select>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExport}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.vendor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${expense.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                            expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {expense.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.employee}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditExpense(expense)}
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                              title="Edit expense"
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveExpense(expense.id, expense.description)}
                              className="h-8 w-8 p-0 hover:bg-red-50"
                              title="Delete expense"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center">
                        <div className="text-gray-500">
                          <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No expenses found</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {searchTerm || statusFilter !== 'all' 
                              ? 'Try adjusting your search or filters' 
                              : 'Add your first expense to get started'
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'optimizer' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Optimizer</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 AI Recommendations</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Reduce office supplies budget by 15% based on usage patterns</li>
                  <li>• Consider bulk purchasing for software licenses (save $2,400/year)</li>
                  <li>• Travel expenses 23% over budget - review approval process</li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">$8,450</p>
                  <p className="text-sm text-green-700">Potential Savings</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">94%</p>
                  <p className="text-sm text-purple-700">Efficiency Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'web3' && (
        <div className="grid grid-cols-1 gap-6">
          <Web3Payments />
        </div>
      )}

      {/* AI Chat Interface */}
      <ChatInterface />

      {/* Analytics Modal */}
      <AnalyticsModal 
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        expenseStats={stats}
        expenses={expenses}
      />

      {/* Edit Expense Modal */}
      <EditExpenseModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingExpense(null)
        }}
        expense={editingExpense}
        onSave={handleSaveExpense}
      />

      {/* Data Management Modal */}
      <DataManagementModal
        isOpen={showDataManagement}
        onClose={() => setShowDataManagement(false)}
        clearAllExpenses={clearAllExpenses}
        resetToDefaults={resetToDefaults}
        exportExpensesData={exportExpensesData}
        importExpensesData={importExpensesData}
        expenseCount={expenses.length}
      />

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Expense</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowExpenseForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
                <input 
                  type="text" 
                  value={expenseFormData.vendor}
                  onChange={(e) => setExpenseFormData(prev => ({ ...prev, vendor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Amazon, Starbucks, Uber"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <input 
                  type="number"
                  step="0.01"
                  value={expenseFormData.amount}
                  onChange={(e) => setExpenseFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input 
                  type="text"
                  value={expenseFormData.description}
                  onChange={(e) => setExpenseFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the expense"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category (AI will suggest if empty)</label>
                <select 
                  value={expenseFormData.category}
                  onChange={(e) => setExpenseFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Let AI categorize</option>
                  <option value="Software">Software</option>
                  <option value="Travel">Travel</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Meals">Meals</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date"
                  value={expenseFormData.date}
                  onChange={(e) => setExpenseFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={handleExpenseSubmit} 
                className="flex-1"
                disabled={isSubmittingExpense}
              >
                {isSubmittingExpense ? 'Adding...' : 'Submit Expense'}
              </Button>
              <Button variant="outline" onClick={() => setShowExpenseForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
