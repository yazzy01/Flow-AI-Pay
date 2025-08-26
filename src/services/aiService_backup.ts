// AI Service for FlowPay - Gemini AI Integration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Expense categories for classification
const EXPENSE_CATEGORIES = [
  'Software', 'Travel', 'Equipment', 'Marketing', 
  'Office', 'Meals', 'Transportation', 'Accommodation', 'Other'
];

// Sample expense data for context
const SAMPLE_EXPENSES = [
  { id: 1, description: 'Adobe Creative Suite', amount: 52.99, category: 'Software', vendor: 'Adobe' },
  { id: 2, description: 'Flight to NYC', amount: 450.00, category: 'Travel', vendor: 'Delta Airlines' },
  { id: 3, description: 'MacBook Pro', amount: 2499.00, category: 'Equipment', vendor: 'Apple' },
  { id: 4, description: 'Uber ride', amount: 25.50, category: 'Transportation', vendor: 'Uber' },
  { id: 5, description: 'Team lunch', amount: 180.00, category: 'Meals', vendor: 'Restaurant' }
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