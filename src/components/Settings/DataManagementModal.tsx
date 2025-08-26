import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Download, 
  Upload, 
  Trash2, 
  RotateCcw,
  Database,
  AlertTriangle,
  CheckCircle,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  clearAllExpenses: () => void;
  resetToDefaults: () => void;
  exportExpensesData: () => string;
  importExpensesData: (data: string) => boolean;
  expenseCount: number;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  clearAllExpenses,
  resetToDefaults,
  exportExpensesData,
  importExpensesData,
  expenseCount
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const { toast } = useToast();

  const handleExportData = () => {
    const data = exportExpensesData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flowpay_expenses_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Data Exported! 📥",
      description: `Backup file created with ${expenseCount} expenses.`,
    });
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (importExpensesData(content)) {
        toast({
          title: "Data Imported Successfully! ✅",
          description: "Your expenses have been restored from the backup file.",
        });
        onClose();
      } else {
        toast({
          title: "Import Failed",
          description: "The file format is invalid or corrupted.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  const handleClearAll = () => {
    clearAllExpenses();
    setShowConfirmClear(false);
    toast({
      title: "All Data Cleared! 🗑️",
      description: "All expenses have been permanently deleted.",
    });
    onClose();
  };

  const handleResetToDefaults = () => {
    resetToDefaults();
    setShowConfirmReset(false);
    toast({
      title: "Data Reset Complete! 🔄",
      description: "Sample expenses have been restored.",
    });
    onClose();
  };

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
          className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Data Management</h2>
              <Badge variant="outline" className="text-xs">
                {expenseCount} expenses
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Data Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Database className="h-4 w-4" />
                  Storage Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stored Expenses:</span>
                  <Badge variant="outline">{expenseCount}</Badge>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">Storage:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    localStorage
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Export/Import Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Backup & Restore</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data Backup
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reset Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Reset Options</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {!showConfirmReset ? (
                  <Button
                    onClick={() => setShowConfirmReset(true)}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Sample Data
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">This will replace all current data with sample expenses.</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleResetToDefaults}
                        size="sm"
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                      >
                        Confirm Reset
                      </Button>
                      <Button
                        onClick={() => setShowConfirmReset(false)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {!showConfirmClear ? (
                  <Button
                    onClick={() => setShowConfirmClear(true)}
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800">This will permanently delete ALL expenses. This cannot be undone!</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleClearAll}
                        size="sm"
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        Permanently Delete
                      </Button>
                      <Button
                        onClick={() => setShowConfirmClear(false)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Note */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> All data is stored locally in your browser. 
                Creating backups is recommended before clearing or resetting data.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

