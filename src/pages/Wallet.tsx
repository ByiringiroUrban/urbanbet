
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/utils/authUtils";
import { processPayment, PaymentMethod, withdrawFunds, getTransactionHistory } from "@/services/paymentService";
import { ArrowUpRight, ArrowDownLeft, Clock, CreditCard, Wallet as WalletIcon, Smartphone, Check, AlertCircle, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet_win' | 'bet_loss' | 'bet' | 'win';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method?: string;
}

const Wallet = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("deposit");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("momo");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const { isLoggedIn, user, refreshUserData } = useAuth();
  
  // Get user data from useAuth
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  
  // Convert balance to RWF dynamically
  const userBalance = user?.balance || 0;
  const userCurrency = user?.currency || 'RWF';
  const balanceRWF = userCurrency === 'USD' ? userBalance * 1200 : userBalance;
  const balanceUSD = userCurrency === 'USD' ? userBalance : userBalance / 1200;
  
  const loadTransactions = async () => {
    const data = await getTransactionHistory();
    const formatted = data.map((txn: any) => ({
      id: txn.id,
      type: txn.type,
      amount: txn.amount,
      status: txn.status,
      date: new Date(txn.timestamp).toISOString().split('T')[0],
      method: txn.method === 'momo' 
        ? "MTN Mobile Money" 
        : txn.method === 'airtel'
          ? "Airtel Money"
          : txn.method === 'irembo'
            ? "Irembo Pay"
            : txn.method === 'card'
              ? "Card Payment"
              : txn.method
    }));
    setTransactions(formatted);
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast({
        title: "Authentication required",
        description: "Please login to access your wallet.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    loadTransactions();
  }, [toast, navigate]);

  const handleTransaction = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    // Phone number validation for mobile money methods
    if ((activeTab === "deposit" || activeTab === "withdraw") && 
        (paymentMethod === "momo" || paymentMethod === "airtel") && 
        !phoneNumber) {
      toast({
        title: "Phone number required",
        description: `Please enter your ${paymentMethod === "momo" ? "MTN Mobile Money" : "Airtel Money"} number.`,
        variant: "destructive",
      });
      return;
    }

    // Card details validation
    if (activeTab === "deposit" && paymentMethod === "card") {
      if (!cardNumber || !expiryDate || !cvv) {
        toast({
          title: "Card details required",
          description: "Please enter all card details.",
          variant: "destructive",
        });
        return;
      }
    }

    // Email validation for Irembo Pay
    if (activeTab === "deposit" && paymentMethod === "irembo") {
      if (!userEmail) {
        toast({
          title: "Email required",
          description: "Please ensure your email is set in your profile for Irembo Pay.",
          variant: "destructive",
        });
        return;
      }
    }

    // Withdrawal balance check
    if (activeTab === "withdraw" && Number(amount) > balanceRWF) {
      toast({
        title: "Insufficient funds",
        description: "Your withdrawal amount exceeds your available balance.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    if (activeTab === "deposit") {
      // Process the payment using our payment service
      const paymentResult = await processPayment({
        amount: Number(amount),
        phoneNumber: phoneNumber || undefined,
        email: userEmail,
        paymentMethod: paymentMethod,
        currency: "RWF",
        description: `Deposit to Urban Bet account`,
        cardDetails: paymentMethod === "card" ? {
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiryDate,
          cvv,
          cardholderName: userName
        } : undefined
      });
      
      if (paymentResult.success) {
        toast({
          title: paymentResult.pending ? "Payment processing" : "Deposit successful",
          description: paymentResult.message,
        });
        
        await refreshUserData();
        await loadTransactions();
      } else {
        // Payment failed
        toast({
          title: "Payment failed",
          description: paymentResult.message,
          variant: "destructive",
        });
      }
    } else {
      // Process withdrawal using payment service
      const paymentResult = await withdrawFunds({
        amount: Number(amount),
        method: paymentMethod === "momo" ? "momo" : "airtel",
        phone_number: phoneNumber,
        currency: "RWF"
      });
      
      if (paymentResult.success) {
        toast({
          title: paymentResult.pending ? "Withdrawal processing" : "Withdrawal successful",
          description: paymentResult.message,
        });
        
        await refreshUserData();
        await loadTransactions();
      } else {
        toast({
          title: "Withdrawal failed",
          description: paymentResult.message,
          variant: "destructive",
        });
      }
    }
    
    setIsLoading(false);
    
    // Reset form
    setAmount("");
    setPhoneNumber("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="text-bet-secondary" />;
      case 'withdrawal':
        return <ArrowDownLeft className="text-bet-primary" />;
      case 'bet':
        return <WalletIcon className="text-bet-danger" />;
      case 'win':
        return <Check className="text-bet-secondary" />;
      default:
        return <Clock />;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="text-bet-secondary" size={14} />;
      case 'pending':
        return <Clock className="text-bet-warning" size={14} />;
      case 'failed':
        return <AlertCircle className="text-bet-danger" size={14} />;
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Allow only numbers
    const numbers = value.replace(/\D/g, "");
    
    // Format as 07X XXX XXXX
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`;
  };

  const formatCardNumber = (value: string) => {
    // Allow only numbers
    const numbers = value.replace(/\D/g, "");
    
    // Format as XXXX XXXX XXXX XXXX
    const chunks = [];
    for (let i = 0; i < numbers.length && i < 16; i += 4) {
      chunks.push(numbers.slice(i, i + 4));
    }
    return chunks.join(" ");
  };

  const formatExpiryDate = (value: string) => {
    // Allow only numbers
    const numbers = value.replace(/\D/g, "");
    
    // Format as MM/YY
    if (numbers.length <= 2) return numbers;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Wallet</h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Balance</CardTitle>
                  <CardDescription>Your current account balance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">RWF {balanceRWF.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mt-1">≈ ${balanceUSD.toLocaleString()}</div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button 
                    className="w-full bg-bet-primary hover:bg-bet-primary/90"
                    onClick={() => {
                      setActiveTab("deposit");
                      window.scrollTo({
                        top: document.querySelector('.wallet-tabs')?.getBoundingClientRect().top,
                        behavior: 'smooth'
                      });
                    }}
                  >
                    <ArrowUpRight size={16} className="mr-2" /> Deposit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setActiveTab("withdraw");
                      window.scrollTo({
                        top: document.querySelector('.wallet-tabs')?.getBoundingClientRect().top,
                        behavior: 'smooth'
                      });
                    }}
                  >
                    <ArrowDownLeft size={16} className="mr-2" /> Withdraw
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Transfer</CardTitle>
                  <CardDescription>Transfer funds to other Urban Bet users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientUsername">Recipient Username</Label>
                      <Input id="recipientUsername" placeholder="Enter username" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transferAmount">Amount (RWF)</Label>
                      <Input id="transferAmount" type="number" min="1" placeholder="Enter amount" />
                    </div>
                    <Button className="w-full">Send Funds</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-2/3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="wallet-tabs">
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="deposit">Deposit</TabsTrigger>
                  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                </TabsList>
                
                <TabsContent value="deposit">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deposit Funds</CardTitle>
                      <CardDescription>Add money to your Urban Bet account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="depositAmount">Amount (RWF)</Label>
                          <Input 
                            id="depositAmount" 
                            type="number" 
                            min="1000" 
                            placeholder="Enter amount" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">Minimum deposit: RWF 1,000</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Payment Method</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div 
                              className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-bet-primary bg-bet-primary/10' : 'border-border hover:border-bet-primary/50'}`}
                              onClick={() => setPaymentMethod('momo')}
                            >
                              <Smartphone size={24} className="mb-2" />
                              <span className="text-sm font-medium">MTN MoMo</span>
                            </div>
                            <div 
                              className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${paymentMethod === 'airtel' ? 'border-bet-primary bg-bet-primary/10' : 'border-border hover:border-bet-primary/50'}`}
                              onClick={() => setPaymentMethod('airtel')}
                            >
                              <Smartphone size={24} className="mb-2" />
                              <span className="text-sm font-medium">Airtel Money</span>
                            </div>
                            <div 
                              className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${paymentMethod === 'irembo' ? 'border-bet-primary bg-bet-primary/10' : 'border-border hover:border-bet-primary/50'}`}
                              onClick={() => setPaymentMethod('irembo')}
                            >
                              <Globe size={24} className="mb-2" />
                              <span className="text-sm font-medium">Irembo Pay</span>
                            </div>
                            <div 
                              className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-bet-primary bg-bet-primary/10' : 'border-border hover:border-bet-primary/50'}`}
                              onClick={() => setPaymentMethod('card')}
                            >
                              <CreditCard size={24} className="mb-2" />
                              <span className="text-sm font-medium">Card</span>
                            </div>
                          </div>
                        </div>
                        
                        {(paymentMethod === 'momo' || paymentMethod === 'airtel') && (
                          <div className="space-y-2">
                            <Label htmlFor="phoneNumber">
                              {paymentMethod === 'momo' ? 'MTN Mobile Money Number' : 'Airtel Money Number'}
                            </Label>
                            <Input 
                              id="phoneNumber" 
                              placeholder="07X XXX XXXX" 
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                            />
                            <p className="text-xs text-muted-foreground">Enter a valid Rwandan phone number</p>
                          </div>
                        )}
                        
                        {paymentMethod === 'irembo' && (
                          <div className="space-y-2">
                            <Label htmlFor="iremboEmail">Email for Irembo Pay</Label>
                            <Input 
                              id="iremboEmail" 
                              type="email"
                              placeholder="Your email address" 
                              value={userEmail}
                              readOnly
                            />
                            <p className="text-xs text-muted-foreground">
                              You will receive payment instructions at this email
                            </p>
                          </div>
                        )}
                        
                        {paymentMethod === 'card' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input 
                                id="cardNumber" 
                                placeholder="XXXX XXXX XXXX XXXX" 
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                maxLength={19} // 16 digits + 3 spaces
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input 
                                  id="expiryDate" 
                                  placeholder="MM/YY" 
                                  value={expiryDate}
                                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                  maxLength={5} // MM/YY
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input 
                                  id="cvv" 
                                  placeholder="XXX" 
                                  type="password" 
                                  maxLength={3}
                                  value={cvv}
                                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleTransaction} 
                        disabled={isLoading || !amount}
                        className="w-full bg-bet-primary hover:bg-bet-primary/90"
                      >
                        {isLoading ? "Processing..." : "Deposit Funds"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="withdraw">
                  <Card>
                    <CardHeader>
                      <CardTitle>Withdraw Funds</CardTitle>
                      <CardDescription>Withdraw money from your Urban Bet account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="withdrawAmount">Amount (RWF)</Label>
                          <Input 
                            id="withdrawAmount" 
                            type="number" 
                            min="5000" 
                            max={balanceRWF}
                            placeholder="Enter amount" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Minimum withdrawal: RWF 5,000</span>
                            <span>Available: RWF {balanceRWF.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Withdrawal Method</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div 
                              className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-bet-primary bg-bet-primary/10' : 'border-border hover:border-bet-primary/50'}`}
                              onClick={() => setPaymentMethod('momo')}
                            >
                              <Smartphone size={24} className="mb-2" />
                              <span className="text-sm font-medium">MTN MoMo</span>
                            </div>
                            <div 
                              className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${paymentMethod === 'airtel' ? 'border-bet-primary bg-bet-primary/10' : 'border-border hover:border-bet-primary/50'}`}
                              onClick={() => setPaymentMethod('airtel')}
                            >
                              <Smartphone size={24} className="mb-2" />
                              <span className="text-sm font-medium">Airtel Money</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="withdrawPhoneNumber">Phone Number</Label>
                          <Input 
                            id="withdrawPhoneNumber" 
                            placeholder="07X XXX XXXX" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                          />
                          <p className="text-xs text-muted-foreground">Enter a valid Rwandan phone number</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleTransaction} 
                        disabled={isLoading || !amount || Number(amount) > balanceRWF}
                        className="w-full"
                      >
                        {isLoading ? "Processing..." : "Withdraw Funds"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Recent account activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 border-b border-border last:border-0">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                              <div className="font-medium">
                                {transaction.type === 'deposit' ? 'Deposit' : 
                                 transaction.type === 'withdrawal' ? 'Withdrawal' :
                                 transaction.type === 'bet' ? 'Bet Placed' : 'Winnings'}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                {transaction.date} 
                                {transaction.method && <span className="ml-1">• {transaction.method}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className={`font-semibold ${transaction.amount > 0 ? 'text-bet-secondary' : ''}`}>
                              {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()} RWF
                            </div>
                            <div className="text-xs flex items-center">
                              {getStatusIcon(transaction.status)}
                              <span className="ml-1">{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No transactions yet
                      </div>
                    )}
                  </div>
                </CardContent>
                {transactions.length > 4 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full">View All Transactions</Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wallet;
