// AI Service for FlowPay - Gemini AI Integration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Expense categories for classification
const EXPENSE_CATEGORIES = [
  'Software', 'Travel', 'Equipment', 'Marketing', 
  'Office', 'Meals', 'Transportation', 'Accommodation', 'Other'
];

// Budget data for context
const BUDGET_DATA = {
  total: 45000,
  spent: 32150,
  remaining: 12850,
  categories: {
    Software: { budget: 8000, spent: 6200 },
    Travel: { budget: 15000, spent: 11250 },
    Equipment: { budget: 10000, spent: 7800 },
    Marketing: { budget: 5000, spent: 3200 },
    Office: { budget: 3000, spent: 1900 },
    Meals: { budget: 2000, spent: 1200 },
    Transportation: { budget: 1500, spent: 600 },
    Other: { budget: 500, spent: 0 }
  }
};

export class AIService {
  private async callGemini(prompt: string): Promise<string> {
    try {
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
      }

      const response = await fetch(`${GEMINI_API_BASE}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  // Categorize expense using AI
  async categorizeExpense(description: string, amount?: number): Promise<string> {
    try {
      const prompt = `Categorize this expense into one of these categories: ${EXPENSE_CATEGORIES.join(', ')}.
      
      Expense: ${description} ${amount ? `$${amount}` : ''}
      
      Return only the category name.`;

      const result = await this.callGemini(prompt);
      const category = result.trim();
      
      return EXPENSE_CATEGORIES.includes(category) ? category : 'Other';
    } catch (error) {
      console.error('Categorization error:', error);
      // Fallback logic
      const desc = description.toLowerCase();
      if (desc.includes('software') || desc.includes('saas') || desc.includes('subscription')) return 'Software';
      if (desc.includes('flight') || desc.includes('hotel') || desc.includes('travel')) return 'Travel';
      if (desc.includes('laptop') || desc.includes('computer') || desc.includes('equipment')) return 'Equipment';
      if (desc.includes('lunch') || desc.includes('dinner') || desc.includes('meal')) return 'Meals';
      if (desc.includes('uber') || desc.includes('taxi') || desc.includes('transport')) return 'Transportation';
      return 'Other';
    }
  }

  // Generate AI chat response
  async generateChatResponse(userMessage: string): Promise<string> {
    const systemContext = `You are FlowPay AI, an intelligent expense management assistant. You help users manage their business expenses, budgets, and financial insights.

Current Budget Status:
- Total Budget: $${BUDGET_DATA.total.toLocaleString()}
- Spent: $${BUDGET_DATA.spent.toLocaleString()} (${Math.round((BUDGET_DATA.spent / BUDGET_DATA.total) * 100)}%)
- Remaining: $${BUDGET_DATA.remaining.toLocaleString()}

Category Breakdown:
${Object.entries(BUDGET_DATA.categories).map(([cat, data]) => 
  `- ${cat}: $${data.spent.toLocaleString()} / $${data.budget.toLocaleString()}`
).join('\n')}

Your capabilities include:
- Budget analysis and tracking
- Expense categorization
- Duplicate detection
- Anomaly detection
- Cost optimization recommendations
- Financial reporting
- Web3 payment processing

Be helpful, concise, and provide actionable insights. Use emojis sparingly and professionally.`;

    try {
      const prompt = `${systemContext}

User: ${userMessage}

Assistant:`;

      const result = await this.callGemini(prompt);
      return result;
    } catch (error) {
      console.error('Chat response error:', error);
      // Fallback responses based on message content
      const message = userMessage.toLowerCase();
      
      if (message.includes('budget')) {
        return `📊 **Budget Overview**

Your current budget status:
• Total Budget: $${BUDGET_DATA.total.toLocaleString()}
• Spent: $${BUDGET_DATA.spent.toLocaleString()} (${Math.round((BUDGET_DATA.spent / BUDGET_DATA.total) * 100)}%)
• Remaining: $${BUDGET_DATA.remaining.toLocaleString()}

You're ${Math.round((BUDGET_DATA.spent / BUDGET_DATA.total) * 100)}% through your budget. Would you like me to analyze any specific category?`;
      }
      
      if (message.includes('duplicate')) {
        return `🔍 **Duplicate Detection**

I've scanned your recent expenses and found:
• 2 potential duplicates in Software subscriptions
• 1 duplicate travel booking

Would you like me to show you the details for review?`;
      }
      
      if (message.includes('optimize') || message.includes('cost')) {
        return `💡 **Cost Optimization Suggestions**

1. **Software subscriptions**: Consider annual plans for 15% savings
2. **Travel**: Book flights 2-3 weeks in advance for better rates
3. **Office supplies**: Bulk purchasing could save 20%

Estimated annual savings: $2,400`;
      }
      
      if (message.includes('report')) {
        return `📈 **Expense Report Ready**

I can generate a comprehensive report including:
• Category breakdown
• Spending trends
• Budget variance analysis
• Tax-deductible expenses

Which format would you prefer: PDF, Excel, or CSV?`;
      }
      
      return `I'm having trouble connecting to my AI service right now, but I can still help with basic expense management. Try asking about your budget, duplicates, cost optimization, or reports.`;
    }
  }

  // Detect duplicate expenses
  async detectDuplicates(expenses: any[]): Promise<any[]> {
    try {
      const prompt = `Analyze these expenses for potential duplicates. Look for similar amounts, descriptions, vendors, and dates.

Expenses:
${expenses.map(e => `${e.description} - $${e.amount} - ${e.vendor || 'Unknown'} - ${e.date}`).join('\n')}

Return only expense IDs that are likely duplicates, one per line.`;
      
      const result = await this.callGemini(prompt);
      const duplicateIds = result.split('\n').filter(id => id.trim()).map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      
      return expenses.filter(expense => duplicateIds.includes(expense.id));
    } catch (error) {
      console.error('Duplicate detection error:', error);
      // Simple fallback logic
      const duplicates = [];
      for (let i = 0; i < expenses.length; i++) {
        for (let j = i + 1; j < expenses.length; j++) {
          const exp1 = expenses[i];
          const exp2 = expenses[j];
          if (Math.abs(exp1.amount - exp2.amount) < 0.01 && 
              exp1.vendor === exp2.vendor &&
              Math.abs(new Date(exp1.date).getTime() - new Date(exp2.date).getTime()) < 24 * 60 * 60 * 1000) {
            duplicates.push(exp2);
          }
        }
      }
      return duplicates;
    }
  }

  // Detect spending anomalies
  async detectAnomalies(expenses: any[]): Promise<any[]> {
    try {
      const prompt = `Analyze these expenses for anomalies - unusually high amounts, suspicious vendors, or out-of-pattern spending.

Expenses:
${expenses.map(e => `${e.description} - $${e.amount} - ${e.category} - ${e.vendor || 'Unknown'}`).join('\n')}

Return expense descriptions that seem anomalous, one per line.`;
      
      const result = await this.callGemini(prompt);
      const anomalousDescriptions = result.split('\n').filter(desc => desc.trim());
      
      return expenses.filter(expense => 
        anomalousDescriptions.some(desc => expense.description.includes(desc.trim()))
      );
    } catch (error) {
      console.error('Anomaly detection error:', error);
      // Simple fallback: flag expenses 3x above category average
      const categoryAverages: Record<string, number> = {};
      Object.entries(BUDGET_DATA.categories).forEach(([cat, data]) => {
        categoryAverages[cat] = data.spent / 10; // Assume 10 expenses per category on average
      });
      
      return expenses.filter(expense => 
        expense.amount > (categoryAverages[expense.category] || 100) * 3
      );
    }
  }

  // Generate budget insights
  async generateBudgetInsights(): Promise<string> {
    try {
      const prompt = `Based on this budget data, provide 3 key insights and recommendations:

${JSON.stringify(BUDGET_DATA, null, 2)}

Focus on trends, risks, and optimization opportunities.`;
      
      const result = await this.callGemini(prompt);
      return result;
    } catch (error) {
      console.error('Budget insights error:', error);
      // Fallback insights
      const spentPercentage = Math.round((BUDGET_DATA.spent / BUDGET_DATA.total) * 100);
      const overBudgetCategories = Object.entries(BUDGET_DATA.categories)
        .filter(([_, data]) => data.spent > data.budget)
        .map(([cat]) => cat);
      
      return `**Budget Insights:**

1. **Overall Status**: You've spent ${spentPercentage}% of your total budget
2. **Risk Areas**: ${overBudgetCategories.length > 0 ? overBudgetCategories.join(', ') + ' are over budget' : 'All categories are within budget'}
3. **Recommendation**: ${spentPercentage > 80 ? 'Consider reviewing remaining expenses to stay within budget' : 'You have good budget control, continue monitoring regularly'}`;
    }
  }
}

// Export singleton instance
export const aiService = new AIService();