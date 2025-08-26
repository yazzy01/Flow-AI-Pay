import { Header } from "@/components/Layout/Header";
import { BudgetOverview } from "@/components/Dashboard/BudgetOverview";
import { PendingApprovals } from "@/components/Dashboard/PendingApprovals";
import { AIInsights } from "@/components/Dashboard/AIInsights";
import { Web3Payments } from "@/components/Dashboard/Web3Payments";
import { ExpenseList } from "@/components/Dashboard/ExpenseList";
import { ChatInterface } from "@/components/AI/ChatInterface";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back, John!</h2>
          <p className="text-muted-foreground">
            Here's your expense overview for January 2024
          </p>
        </motion.div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <BudgetOverview />
          <PendingApprovals />
          <AIInsights />
          <Web3Payments />
        </div>

        {/* Recent Expenses Table */}
        <ExpenseList />
      </main>

      {/* AI Chat Interface */}
      <ChatInterface />
    </div>
  );
};

export default Index;
