import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';

const queryClient = new QueryClient();

function App() {
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-gray-50">
          <Header 
            searchTerm={globalSearchTerm} 
            onSearchChange={setGlobalSearchTerm} 
          />
          <main>
            <Dashboard 
              globalSearchTerm={globalSearchTerm}
              onSearchChange={setGlobalSearchTerm}
            />
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
