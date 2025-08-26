import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Brain,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseStats: {
    total: number;
    count: number;
    pending: number;
    approved: number;
    flagged: number;
    categoryTotals: Record<string, number>;
  };
  expenses: any[];
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ 
  isOpen, 
  onClose, 
  expenseStats, 
  expenses 
}) => {
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateAIInsights();
    }
  }, [isOpen]);

  const generateAIInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const { aiService } = await import('@/services/aiService');
      const insights = await aiService.generateBudgetInsights();
      setAiInsights(insights);
    } catch (error) {
      setAiInsights(`**AI Insights:**

1. **Overall Spending**: You've spent $${expenseStats.total.toFixed(2)} across ${expenseStats.count} expenses
2. **Status Distribution**: ${expenseStats.approved} approved, ${expenseStats.pending} pending, ${expenseStats.flagged} flagged
3. **Top Categories**: ${Object.entries(expenseStats.categoryTotals)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 3)
  .map(([cat, amount]) => `${cat} ($${amount.toFixed(2)})`)
  .join(', ')}

**Recommendations:**
• Review pending expenses for faster processing
• Consider consolidating similar vendor expenses
• Set up automated approval workflows for small amounts`);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const topCategories = Object.entries(expenseStats.categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const recentTrend = expenses.length > 5 ? 
    expenses.slice(0, 3).reduce((sum, e) => sum + e.amount, 0) / 3 -
    expenses.slice(3, 6).reduce((sum, e) => sum + e.amount, 0) / 3 : 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">AI-Powered Analytics Dashboard</h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-600">
                <Brain className="h-3 w-3 mr-1" />
                AI Insights
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold">${expenseStats.total.toFixed(2)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Expenses</p>
                      <p className="text-2xl font-bold">{expenseStats.count}</p>
                    </div>
                    <PieChart className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending Review</p>
                      <p className="text-2xl font-bold">{expenseStats.pending}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Average</p>
                      <p className="text-2xl font-bold">${(expenseStats.total / expenseStats.count || 0).toFixed(2)}</p>
                    </div>
                    {recentTrend > 0 ? (
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Insights Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Category Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCategories.map(([category, amount], index) => {
                      const percentage = (amount / expenseStats.total) * 100;
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{category}</span>
                            <span className="text-sm text-gray-600">${amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${colors[index]}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Approval Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Approved</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{expenseStats.approved}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">Pending</span>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">{expenseStats.pending}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-600" />
                        <span className="font-medium">Flagged</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800">{expenseStats.flagged}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingInsights ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-gray-600">Generating AI insights...</span>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {aiInsights}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleString()}
            </p>
            <Button onClick={onClose}>
              Close Analytics
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
