import { useState, useEffect } from 'react';

export interface Expense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  employee: string;
  description: string;
  receipt_url?: string;
  ai_confidence?: number;
  is_anomaly?: boolean;
  blockchain_tx_hash?: string;
  created_at: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  pendingApprovals: number;
  monthlySpent: number;
  monthlyBudget: number;
  categories: Record<string, number>;
}

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats>({
    totalExpenses: 0,
    pendingApprovals: 0,
    monthlySpent: 0,
    monthlyBudget: 45000,
    categories: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockExpenses: Expense[] = [
    {
      id: '1',
      date: '2024-01-15',
      vendor: 'Amazon Web Services',
      category: 'Software',
      amount: 2850.00,
      status: 'approved',
      employee: 'Sarah Chen',
      description: 'Cloud hosting services',
      ai_confidence: 0.94,
      is_anomaly: false,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      date: '2024-01-14',
      vendor: 'Delta Airlines',
      category: 'Travel',
      amount: 1245.50,
      status: 'pending',
      employee: 'Mike Johnson',
      description: 'Flight to client meeting',
      ai_confidence: 0.87,
      is_anomaly: true,
      created_at: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      date: '2024-01-14',
      vendor: 'Office Depot',
      category: 'Office Supplies',
      amount: 89.99,
      status: 'flagged',
      employee: 'Emma Davis',
      description: 'Printer paper and supplies',
      ai_confidence: 0.76,
      is_anomaly: false,
      created_at: '2024-01-14T09:15:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setExpenses(mockExpenses);
        
        // Calculate stats
        const totalExpenses = mockExpenses.length;
        const pendingApprovals = mockExpenses.filter(e => e.status === 'pending').length;
        const monthlySpent = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
        
        const categories = mockExpenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {} as Record<string, number>);
        
        setStats({
          totalExpenses,
          pendingApprovals,
          monthlySpent,
          monthlyBudget: 45000,
          categories
        });
        
      } catch (err) {
        setError('Failed to fetch expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const submitExpense = async (expenseData: Partial<Expense>) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newExpense: Expense = {
        id: Date.now().toString(),
        date: expenseData.date || new Date().toISOString().split('T')[0],
        vendor: expenseData.vendor || '',
        category: expenseData.category || '',
        amount: expenseData.amount || 0,
        status: 'pending',
        employee: 'Current User',
        description: expenseData.description || '',
        ai_confidence: Math.random() * 0.3 + 0.7, // 70-100%
        is_anomaly: Math.random() < 0.1, // 10% chance
        created_at: new Date().toISOString()
      };
      
      setExpenses(prev => [newExpense, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalExpenses: prev.totalExpenses + 1,
        pendingApprovals: prev.pendingApprovals + 1,
        monthlySpent: prev.monthlySpent + newExpense.amount,
        categories: {
          ...prev.categories,
          [newExpense.category]: (prev.categories[newExpense.category] || 0) + newExpense.amount
        }
      }));
      
      return newExpense;
    } catch (err) {
      setError('Failed to submit expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveExpense = async (expenseId: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setExpenses(prev => prev.map(expense => 
        expense.id === expenseId 
          ? { ...expense, status: 'approved' as const }
          : expense
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1
      }));
      
    } catch (err) {
      setError('Failed to approve expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectExpense = async (expenseId: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setExpenses(prev => prev.map(expense => 
        expense.id === expenseId 
          ? { ...expense, status: 'rejected' as const }
          : expense
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1
      }));
      
    } catch (err) {
      setError('Failed to reject expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    stats,
    loading,
    error,
    submitExpense,
    approveExpense,
    rejectExpense
  };
};