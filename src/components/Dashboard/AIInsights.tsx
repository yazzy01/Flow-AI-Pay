import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export const AIInsights = () => {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);

  const insights = [
    {
      id: 1,
      type: "Budget Alert",
      icon: AlertTriangle,
      message: "Software category is 15% over budget",
      details: "You've spent $23,400 on software this month vs. budgeted $20,000. Consider reviewing recurring subscriptions.",
      severity: "warning",
      confidence: 94
    },
    {
      id: 2,
      type: "Anomaly Detection",
      icon: Brain,
      message: "Unusual travel expense detected",
      details: "The $4,200 flight expense is 180% higher than your typical travel costs. This may require additional approval.",
      severity: "info",
      confidence: 87
    },
    {
      id: 3,
      type: "Optimization",
      icon: Lightbulb,
      message: "Potential savings opportunity",
      details: "Switching to annual billing for 3 software subscriptions could save $2,400 yearly.",
      severity: "success",
      confidence: 91
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'info': return 'text-primary bg-primary/10 border-primary/20';
      case 'success': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="relative overflow-hidden bg-gradient-card backdrop-blur-sm border border-white/20 shadow-card hover:shadow-hover transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-secondary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const isExpanded = expandedInsight === insight.id;
            
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="group"
              >
                <div
                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer"
                  onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className={`h-4 w-4 mt-0.5 ${getSeverityColor(insight.severity).split(' ')[0]}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={getSeverityColor(insight.severity)}>
                            {insight.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1">{insight.message}</p>
                        
                        <motion.div
                          initial={false}
                          animate={{
                            height: isExpanded ? "auto" : 0,
                            opacity: isExpanded ? 1 : 0
                          }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-muted-foreground mt-2">
                            {insight.details}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                    
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
};