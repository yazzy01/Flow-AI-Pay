import { ExpenseForm } from "@/components/Expense/ExpenseForm";
import { Header } from "@/components/Layout/Header";
import { motion } from "framer-motion";

const ExpenseSubmission = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Submit New Expense</h2>
          <p className="text-muted-foreground">
            Upload your receipt and let AI handle the rest
          </p>
        </motion.div>

        <ExpenseForm />
      </main>
    </div>
  );
};

export default ExpenseSubmission;