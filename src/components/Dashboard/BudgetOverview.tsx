import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export const BudgetOverview = () => {
  const budget = 45000;
  const spent = 32150;
  const remaining = budget - spent;
  const percentage = (spent / budget) * 100;

  const trendData = [
    { day: "Mon", amount: 1200 },
    { day: "Tue", amount: 1850 },
    { day: "Wed", amount: 900 },
    { day: "Thu", amount: 2100 },
    { day: "Fri", amount: 1650 },
    { day: "Sat", amount: 800 },
    { day: "Sun", amount: 1100 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-gradient-card backdrop-blur-sm border border-white/20 shadow-card hover:shadow-hover transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Budget Overview
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Budget</p>
              <p className="text-2xl font-bold">${budget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold text-success">${remaining.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Spent: ${spent.toLocaleString()}</span>
              <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
            </div>
            
            <Progress 
              value={percentage} 
              className="h-3 bg-muted/50"
              style={{
                background: `linear-gradient(to right, 
                  hsl(var(--primary)) 0%, 
                  hsl(var(--warning)) ${percentage > 70 ? '70%' : '100%'}, 
                  hsl(var(--destructive)) ${percentage > 90 ? '90%' : '100%'})`
              }}
            />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">7-Day Trend</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm text-success">+12%</span>
              </div>
            </div>
            
            <div className="flex items-end gap-1 h-12">
              {trendData.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.amount / 2500) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gradient-primary rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                  title={`${day.day}: $${day.amount}`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};