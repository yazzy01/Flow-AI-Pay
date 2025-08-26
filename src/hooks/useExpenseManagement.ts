import { useState, useCallback, useEffect } from 'react';

export interface Expense {
  id: number;
  date: string;
  vendor: string;
  category: string;
  amount: number;
  status: 'approved' | 'pending' | 'flagged';
  employee: string;
  description: string;
  submittedAt?: Date;
}

const initialExpenses: Expense[] = [
  {
    id: 1,
    date: "2024-01-15",
    vendor: "Amazon Web Services",
    category: "Software",
    amount: 2850.00,
    status: "approved",
    employee: "Sarah Chen",
    description: "Cloud hosting services",
    submittedAt: new Date("2024-01-15T10:30:00")
  },
  {
    id: 2,
    date: "2024-01-14",
    vendor: "Delta Airlines",
    category: "Travel",
    amount: 1245.50,
    status: "pending",
    employee: "Mike Johnson",
    description: "Flight to client meeting",
    submittedAt: new Date("2024-01-14T14:20:00")
  },
  {
    id: 3,
    date: "2024-01-14",
    vendor: "Office Depot",
    category: "Office Supplies",
    amount: 89.99,
    status: "flagged",
    employee: "Emma Davis",
    description: "Printer paper and supplies",
    submittedAt: new Date("2024-01-14T09:15:00")
  },
  {
    id: 4,
    date: "2024-01-13",
    vendor: "Starbucks",
    category: "Meals",
    amount: 24.50,
    status: "approved",
    employee: "John Smith",
    description: "Client coffee meeting",
    submittedAt: new Date("2024-01-13T11:45:00")
  },
  {
    id: 5,
    date: "2024-01-13",
    vendor: "Adobe",
    category: "Software",
    amount: 599.99,
    status: "pending",
    employee: "Lisa Wong",
    description: "Creative Suite license",
    submittedAt: new Date("2024-01-13T16:30:00")
  },
  {
    id: 6,
    date: "2024-01-12",
    vendor: "Uber",
    category: "Travel",
    amount: 45.00,
    status: "approved",
    employee: "Tom Brown",
    description: "Airport transfer",
    submittedAt: new Date("2024-01-12T18:20:00")
  }
];

export interface NewExpenseData {
  vendor: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const STORAGE_KEY = 'flowpay_expenses';

// Helper function to load expenses from localStorage
const loadExpensesFromStorage = (): Expense[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects for submittedAt
      return parsed.map((expense: any) => ({
        ...expense,
        submittedAt: expense.submittedAt ? new Date(expense.submittedAt) : undefined
      }));
    }
  } catch (error) {
    console.error('Failed to load expenses from localStorage:', error);
  }
  return initialExpenses;
};

// Helper function to save expenses to localStorage
const saveExpensesToStorage = (expenses: Expense[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    console.log('💾 Expenses saved to localStorage:', expenses.length, 'items');
  } catch (error) {
    console.error('Failed to save expenses to localStorage:', error);
  }
};

export const useExpenseManagement = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpensesFromStorage());

  // Save to localStorage whenever expenses change
  useEffect(() => {
    saveExpensesToStorage(expenses);
  }, [expenses]);

  const addExpense = useCallback(async (newExpenseData: NewExpenseData) => {
    // Use AI to categorize if category is empty
    let category = newExpenseData.category;
    if (!category) {
      try {
        const { aiService } = await import('@/services/aiService');
        category = await aiService.categorizeExpense(newExpenseData.description, newExpenseData.amount);
      } catch (error) {
        console.error('AI categorization failed:', error);
        category = 'Other';
      }
    }

    const newExpense: Expense = {
      id: Math.max(...expenses.map(e => e.id)) + 1,
      date: newExpenseData.date,
      vendor: newExpenseData.vendor,
      category,
      amount: newExpenseData.amount,
      status: 'pending',
      employee: 'John Doe', // Current user
      description: newExpenseData.description,
      submittedAt: new Date()
    };

    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    return newExpense;
  }, [expenses]);

  const updateExpenseStatus = useCallback((id: number, status: Expense['status']) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === id ? { ...expense, status } : expense
      )
    );
  }, []);

  const updateExpense = useCallback((id: number, updatedExpense: Partial<Expense>) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      )
    );
  }, []);

  const removeExpense = useCallback((id: number) => {
    setExpenses(prevExpenses =>
      prevExpenses.filter(expense => expense.id !== id)
    );
  }, []);

  const getExpenseStats = useCallback(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const pending = expenses.filter(e => e.status === 'pending').length;
    const approved = expenses.filter(e => e.status === 'approved').length;
    const flagged = expenses.filter(e => e.status === 'flagged').length;

    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      count: expenses.length,
      pending,
      approved,
      flagged,
      categoryTotals
    };
  }, [expenses]);

  const getRecentExpenses = useCallback((limit = 5) => {
    return expenses
      .sort((a, b) => new Date(b.submittedAt || b.date).getTime() - new Date(a.submittedAt || a.date).getTime())
      .slice(0, limit);
  }, [expenses]);

  const clearAllExpenses = useCallback(() => {
    setExpenses([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const resetToDefaults = useCallback(() => {
    setExpenses(initialExpenses);
    saveExpensesToStorage(initialExpenses);
  }, []);

  const exportExpensesData = useCallback(() => {
    return JSON.stringify(expenses, null, 2);
  }, [expenses]);

  const importExpensesData = useCallback((jsonData: string) => {
    try {
      const importedExpenses = JSON.parse(jsonData);
      if (Array.isArray(importedExpenses)) {
        const validatedExpenses = importedExpenses.map((expense: any) => ({
          ...expense,
          submittedAt: expense.submittedAt ? new Date(expense.submittedAt) : undefined
        }));
        setExpenses(validatedExpenses);
        return true;
      }
    } catch (error) {
      console.error('Failed to import expenses:', error);
    }
    return false;
  }, []);

  return {
    expenses,
    addExpense,
    updateExpenseStatus,
    updateExpense,
    removeExpense,
    getExpenseStats,
    getRecentExpenses,
    clearAllExpenses,
    resetToDefaults,
    exportExpensesData,
    importExpensesData
  };
};

export default useExpenseManagement;
