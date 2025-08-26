import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Save, 
  Calendar,
  DollarSign,
  Building,
  Tag,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import type { Expense } from '@/hooks/useExpenseManagement';

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  onSave: (id: number, updatedExpense: Partial<Expense>) => void;
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSave
}) => {
  const [formData, setFormData] = useState({
    vendor: '',
    amount: '',
    category: '',
    description: '',
    date: '',
    status: 'pending' as Expense['status']
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (expense && isOpen) {
      setFormData({
        vendor: expense.vendor,
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description,
        date: expense.date,
        status: expense.status
      });
    }
  }, [expense, isOpen]);

  const handleSave = async () => {
    if (!expense) return;

    if (!formData.vendor || !formData.amount || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Use AI to re-categorize if category changed
      let category = formData.category;
      if (!category || category !== expense.category) {
        try {
          const { aiService } = await import('@/services/aiService');
          category = await aiService.categorizeExpense(formData.description, parseFloat(formData.amount));
        } catch (error) {
          console.error('AI categorization failed:', error);
          category = formData.category || 'Other';
        }
      }

      const updatedExpense: Partial<Expense> = {
        vendor: formData.vendor,
        amount: parseFloat(formData.amount),
        category,
        description: formData.description,
        date: formData.date,
        status: formData.status
      };

      onSave(expense.id, updatedExpense);
      
      toast({
        title: "Expense Updated! ✅",
        description: `"${formData.description}" has been updated successfully.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = (newStatus: Expense['status']) => {
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  if (!isOpen || !expense) return null;

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
          className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Edit Expense</h2>
              <Badge variant="outline" className="text-xs">
                ID: {expense.id}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Vendor */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Building className="h-4 w-4" />
                Vendor *
              </Label>
              <Input
                value={formData.vendor}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                placeholder="e.g., Amazon, Starbucks, Uber"
                className="w-full"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4" />
                Amount *
              </Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Description *
              </Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the expense"
                className="w-full"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4" />
                Category (AI will re-categorize if changed)
              </Label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
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

            {/* Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Date
              </Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex gap-2">
                <Button
                  variant={formData.status === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('pending')}
                  className={formData.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                >
                  Pending
                </Button>
                <Button
                  variant={formData.status === 'approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('approved')}
                  className={formData.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  Approved
                </Button>
                <Button
                  variant={formData.status === 'flagged' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('flagged')}
                  className={formData.status === 'flagged' ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  Flagged
                </Button>
              </div>
            </div>

            {/* Original vs New Preview */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Preview Changes:</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendor:</span>
                  <span className={expense.vendor !== formData.vendor ? 'text-blue-600 font-medium' : ''}>
                    {formData.vendor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className={expense.amount.toString() !== formData.amount ? 'text-blue-600 font-medium' : ''}>
                    ${formData.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      expense.status !== formData.status ? 'bg-blue-50 text-blue-600 border-blue-200' : ''
                    }`}
                  >
                    {formData.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
