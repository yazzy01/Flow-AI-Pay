import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Brain,
  ArrowRight,
  ArrowLeft,
  FileText,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ExpenseFormData {
  vendor: string;
  amount: string;
  category: string;
  date: string;
  description: string;
  businessPurpose: string;
  receipt?: File;
}

export const ExpenseForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ExpenseFormData>({
    vendor: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    businessPurpose: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState({
    category: "Software",
    confidence: 92,
    vendor: "Amazon Web Services"
  });
  const { toast } = useToast();

  const steps = [
    { id: 1, title: "Upload Receipt", icon: Upload },
    { id: 2, title: "Expense Details", icon: FileText },
    { id: 3, title: "Review & Submit", icon: CheckCircle }
  ];

  const categories = [
    "Software", "Travel", "Equipment", "Marketing", 
    "Office Supplies", "Meals", "Training", "Other"
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    setFormData(prev => ({ ...prev, receipt: file }));
    setAiProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        vendor: "Amazon Web Services",
        amount: "2850.00",
        category: "Software",
        description: "AWS Cloud hosting services - January 2024"
      }));
      setAiProcessing(false);
      toast({
        title: "Receipt processed successfully",
        description: "AI has extracted expense details from your receipt.",
      });
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Expense submitted successfully",
      description: "Your expense has been sent for approval.",
    });
    // Reset form
    setFormData({
      vendor: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
      businessPurpose: "",
    });
    setCurrentStep(1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Drop your receipt here</h3>
              <p className="text-muted-foreground mb-4">
                Support for images and PDFs up to 10MB
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Simulate camera functionality
                    const demoFile = new File(['demo'], 'camera-receipt.jpg', { type: 'image/jpeg' });
                    handleFileUpload(demoFile);
                  }}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>

            {formData.receipt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-muted/30 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{formData.receipt.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(formData.receipt.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                
                {aiProcessing && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-secondary animate-pulse" />
                      <span className="text-sm">Processing with AI...</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input
                  id="vendor"
                  value={formData.vendor}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                  placeholder="Enter vendor name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {aiSuggestions.category && (
                    <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                      <Brain className="h-3 w-3 mr-1" />
                      AI: {aiSuggestions.confidence}%
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the expense"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessPurpose">Business Purpose</Label>
              <Textarea
                id="businessPurpose"
                value={formData.businessPurpose}
                onChange={(e) => setFormData(prev => ({ ...prev, businessPurpose: e.target.value }))}
                placeholder="Explain the business purpose of this expense"
                rows={3}
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Expense Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-medium">{formData.vendor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">${formData.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{formData.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(formData.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{formData.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-secondary" />
                <span className="font-medium">AI Analysis</span>
                <Badge className="bg-success/10 text-success border-success/20">
                  {aiSuggestions.confidence}% Confidence
                </Badge>
              </div>
              
              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Policy Compliant</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This expense meets all company policy requirements.
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto bg-gradient-card backdrop-blur-sm border border-white/20 shadow-card">
      <CardHeader>
        <CardTitle>Submit New Expense</CardTitle>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mt-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted ? 'bg-success text-success-foreground' :
                    isActive ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-4 transition-colors ${
                    isCompleted ? 'bg-success' : 'bg-muted'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </CardHeader>
      
      <CardContent>
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 3 ? (
            <Button
              onClick={nextStep}
              disabled={currentStep === 1 && !formData.receipt}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-gradient-primary">
              Submit Expense
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};