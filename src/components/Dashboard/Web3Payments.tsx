import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink, CheckCircle, Circle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';

export const Web3Payments = () => {
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem('wallet_connected') === 'true';
  });
  const [address, setAddress] = useState<string>(() => {
    return localStorage.getItem('wallet_address') || '';
  });
  const [balances, setBalances] = useState<Record<string, string>>({});

  const supportedTokens = [
    { symbol: "USDC", name: "USD Coin", balance: balances.USDC || "0.00", connected: isConnected },
    { symbol: "DAI", name: "Dai Stablecoin", balance: balances.DAI || "0.00", connected: isConnected },
    { symbol: "USDT", name: "Tether USD", balance: balances.USDT || "0.00", connected: isConnected },
    { symbol: "ETH", name: "Ethereum", balance: balances.ETH || "0.00", connected: isConnected }
  ];

  // Mock wallet connection for demo and check for existing connection on mount
  useEffect(() => {
    // Check if wallet was previously connected
    const savedConnection = localStorage.getItem('wallet_connected') === 'true';
    const savedAddress = localStorage.getItem('wallet_address');
    
    console.log('🔍 Checking wallet state:', { savedConnection, savedAddress, isConnected, address });
    
    if (savedConnection && savedAddress) {
      if (!isConnected || address !== savedAddress) {
        setIsConnected(true);
        setAddress(savedAddress);
        console.log('🔄 Restored wallet connection from localStorage:', savedAddress);
      }
    }
  }, []);

  // Load balances when connected
  useEffect(() => {
    if (isConnected && address) {
      setBalances({
        USDC: "12,450.00",
        DAI: "8,230.50",
        USDT: "5,680.25",
        ETH: "2.45"
      });
      console.log('💰 Balances loaded for connected wallet:', address);
    } else {
      setBalances({});
      console.log('💸 Balances cleared - wallet disconnected');
    }
  }, [isConnected, address]);

  const handleConnect = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        // Request account access
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          const account = accounts[0];
          setAddress(account);
          setIsConnected(true);
          
          // Save to localStorage
          localStorage.setItem('wallet_connected', 'true');
          localStorage.setItem('wallet_address', account);
          
          // Listen for account changes
          (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              handleDisconnect();
            } else {
              setAddress(accounts[0]);
              localStorage.setItem('wallet_address', accounts[0]);
            }
          });

          // Listen for chain changes
          (window as any).ethereum.on('chainChanged', () => {
            window.location.reload();
          });
          
          console.log(`✅ Wallet Connected! Address: ${account}`);
        }
      } else {
        // MetaMask not installed - use demo mode
        const demoAddress = "0x742d35Cc6634C0532925a3b8D4C1a8a2d1234567";
        setAddress(demoAddress);
        setIsConnected(true);
        localStorage.setItem('wallet_connected', 'true');
        localStorage.setItem('wallet_address', demoAddress);
        console.log('🔗 Demo wallet connected for testing purposes');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // Fallback to demo mode on error
      const demoAddress = "0x742d35Cc6634C0532925a3b8D4C1a8a2d1234567";
      setAddress(demoAddress);
      setIsConnected(true);
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_address', demoAddress);
      console.log('🔗 Demo wallet connected (fallback mode)');
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress("");
    setBalances({});
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
    console.log('🔌 Wallet disconnected successfully');
  };

  const recentTransactions = [
    {
      hash: "0x1a2b3c...f7g8h9",
      amount: "2,450.00 USDC",
      status: "confirmed",
      timestamp: "2 hours ago"
    },
    {
      hash: "0x9z8y7x...c3b2a1",
      amount: "890.50 DAI",
      status: "pending",
      timestamp: "5 hours ago"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="relative overflow-hidden bg-gradient-card backdrop-blur-sm border border-white/20 shadow-card hover:shadow-hover transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-secondary" />
              Web3 Payments
            </div>
            {isConnected ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
                {address && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                )}
              </div>
            ) : (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                <Circle className="h-3 w-3 mr-1" />
                Disconnected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isConnected && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">Connect your wallet to view balances and make payments</p>
              <Button onClick={handleConnect} className="bg-gradient-primary hover:opacity-90">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          )}
          
          {isConnected && address && (
            <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-success font-semibold">✅ Wallet Connected</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDisconnect}
                  className="text-xs border-warning text-warning hover:bg-warning/10"
                >
                  Disconnect
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Address:</p>
              <p className="text-sm font-mono text-success">{address.slice(0, 6)}...{address.slice(-4)}</p>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium mb-3">Supported Tokens</h4>
            <div className="grid grid-cols-2 gap-2">
              {supportedTokens.map((token, index) => (
                <motion.div
                  key={token.symbol}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {token.connected ? (
                      <CheckCircle className="h-3 w-3 text-success" />
                    ) : (
                      <Circle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-xs font-medium">{token.symbol}</p>
                      <p className="text-xs text-muted-foreground">{token.balance}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Recent Transactions</h4>
            <div className="space-y-2">
              {recentTransactions.map((tx, index) => (
                <motion.div
                  key={tx.hash}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
                  onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                >
                  <div>
                    <p className="text-xs font-medium">{tx.amount}</p>
                    <p className="text-xs text-muted-foreground">{tx.hash}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={tx.status === 'confirmed' ? 'default' : 'secondary'}
                      className={tx.status === 'confirmed' 
                        ? 'bg-success/10 text-success border-success/20' 
                        : 'bg-warning/10 text-warning border-warning/20'
                      }
                    >
                      {tx.status}
                    </Badge>
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full group">
            View All Transactions
            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};