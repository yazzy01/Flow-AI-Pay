import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const PendingApprovals = () => {
  const pendingExpenses = [
    {
      id: 1,
      employee: "Sarah Chen",
      amount: 2450,
      category: "Travel",
      description: "Flight to NYC conference",
      date: "2024-01-15",
      urgent: true
    },
    {
      id: 2,
      employee: "Mike Johnson",
      amount: 890,
      category: "Equipment",
      description: "Monitor and keyboard",
      date: "2024-01-14",
      urgent: false
    },
    {
      id: 3,
      employee: "Emma Davis",
      amount: 156,
      category: "Meals",
      description: "Client lunch meeting",
      date: "2024-01-14",
      urgent: false
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="relative overflow-hidden bg-gradient-card backdrop-blur-sm border border-white/20 shadow-card hover:shadow-hover transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Pending Approvals
            </div>
            <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
              8 pending
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {pendingExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{expense.employee}</p>
                    <p className="text-xs text-muted-foreground">{expense.description}</p>
                  </div>
                </div>
                {expense.urgent && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
              
              <div className="text-right">
                <p className="font-semibold">${expense.amount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{expense.category}</p>
              </div>
            </motion.div>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full mt-4 group"
            size="sm"
          >
            View All Approvals
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};