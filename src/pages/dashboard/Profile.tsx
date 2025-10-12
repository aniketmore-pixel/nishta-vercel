import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  User, 
  Home as HomeIcon, 
  Wallet, 
  FileText, 
  CreditCard,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  Shield,
  Link as LinkIcon,
  Upload,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form Schemas
const basicDetailsSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  fatherSpouseName: z.string().min(2, "This field is required"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  aadhaar: z.string().length(12, "Aadhaar must be 12 digits"),
  mobile: z.string().length(10, "Mobile number must be 10 digits"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(10, "Address must be at least 10 characters"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  category: z.enum(["SC", "ST", "OBC", "Others"]),
  maritalStatus: z.string().optional(),
  educationLevel: z.string().optional(),
});

const incomeDetailsSchema = z.object({
  employmentType: z.enum(["Self-employed", "Salaried", "Labour", "Unemployed"]),
  primaryIncomeSource: z.string().min(2, "This field is required"),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  secondaryIncome: z.string().optional(),
  householdMembers: z.string().min(1, "This field is required"),
});

const bankDetailsSchema = z.object({
  accountHolderName: z.string().min(2, "Account holder name is required"),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(9, "Invalid account number"),
  confirmAccountNumber: z.string().min(9, "Invalid account number"),
  ifscCode: z.string().length(11, "IFSC code must be 11 characters"),
  branchName: z.string().optional(),
  upiId: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "You must give consent"),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"],
});

const expensesSchema = z.object({
  monthlyHouseholdExpenses: z.string().min(1, "This field is required"),
  monthlyBusinessExpenses: z.string().optional(),
  monthlyLoanRepayments: z.string().optional(),
  electricityBill: z.string().optional(),
  mobileRecharge: z.string().optional(),
  otherUtilities: z.string().optional(),
  commodities: z.array(z.string()).optional(),
  remarks: z.string().optional(),
});

const loanApplicationSchema = z.object({
  loanAmount: z.string().min(1, "Loan amount is required"),
  purpose: z.string().min(10, "Please provide purpose (minimum 10 characters)"),
});

const profileSections = [
  { id: "basic", title: "Basic Details", icon: User, completed: false },
  { id: "income", title: "Income Details", icon: Wallet, completed: false },
  { id: "bank", title: "Bank Details", icon: CreditCard, completed: false },
  { id: "expenses", title: "Expenses & Commodities", icon: HomeIcon, completed: false },
  { id: "documents", title: "Submit Documents", icon: FileText, completed: false },
  { id: "loan", title: "Apply for Loan", icon: DollarSign, completed: false },
];

const Profile = () => {
  const [selectedSection, setSelectedSection] = useState("basic");
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const { toast } = useToast();
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [digilockerConnected, setDigilockerConnected] = useState(false);
  const [billApiConnected, setBillApiConnected] = useState(false);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  
  const completedCount = completedSections.length;
  const progressPercentage = (completedCount / profileSections.length) * 100;

  const basicForm = useForm<z.infer<typeof basicDetailsSchema>>({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      gender: "male",
      category: "SC",
    },
  });

  const incomeForm = useForm<z.infer<typeof incomeDetailsSchema>>({
    resolver: zodResolver(incomeDetailsSchema),
    defaultValues: {
      employmentType: "Self-employed",
    },
  });

  const bankForm = useForm<z.infer<typeof bankDetailsSchema>>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      consent: false,
    },
  });

  const expensesForm = useForm<z.infer<typeof expensesSchema>>({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      commodities: [],
    },
  });

  const loanForm = useForm<z.infer<typeof loanApplicationSchema>>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      loanAmount: "",
      purpose: "",
    },
  });

  const [loanAmount, setLoanAmount] = useState(0);
  const [showExpensesForLoan, setShowExpensesForLoan] = useState(false);
  const LOAN_THRESHOLD = 100000; // ₹1 Lakh threshold

  const onBasicSubmit = (data: z.infer<typeof basicDetailsSchema>) => {
    console.log("Basic Details:", data);
    if (!completedSections.includes("basic")) {
      setCompletedSections([...completedSections, "basic"]);
    }
    toast({
      title: "Basic Details Saved",
      description: "Your basic information has been saved successfully.",
    });
  };

  const onIncomeSubmit = (data: z.infer<typeof incomeDetailsSchema>) => {
    console.log("Income Details:", data);
    if (!completedSections.includes("income")) {
      setCompletedSections([...completedSections, "income"]);
    }
    toast({
      title: "Income Details Saved",
      description: "Your income information has been saved successfully.",
    });
  };

  const onBankSubmit = (data: z.infer<typeof bankDetailsSchema>) => {
    console.log("Bank Details:", data);
    if (!completedSections.includes("bank")) {
      setCompletedSections([...completedSections, "bank"]);
    }
    toast({
      title: "Bank Details Saved",
      description: "Your bank information has been saved successfully.",
    });
  };

  const onExpensesSubmit = (data: z.infer<typeof expensesSchema>) => {
    console.log("Expenses Details:", data);
    if (!completedSections.includes("expenses")) {
      setCompletedSections([...completedSections, "expenses"]);
    }
    toast({
      title: "Expenses Details Saved",
      description: "Your expense information has been saved successfully.",
    });
  };

  const handleDocumentSubmit = () => {
    if (!aadhaarVerified) {
      toast({
        title: "Aadhaar Verification Required",
        description: "Please verify your Aadhaar card before submitting documents.",
        variant: "destructive",
      });
      return;
    }
    
    if (!completedSections.includes("documents")) {
      setCompletedSections([...completedSections, "documents"]);
    }
    toast({
      title: "Documents Submitted",
      description: "Your documents have been uploaded successfully.",
    });
  };

  const handleAadhaarVerification = async (method: 'blockchain' | 'digilocker') => {
    setVerifyingAadhaar(true);
    
    // Simulate verification process
    setTimeout(() => {
      setVerifyingAadhaar(false);
      setAadhaarVerified(true);
      if (method === 'digilocker') {
        setDigilockerConnected(true);
      }
      toast({
        title: "Aadhaar Verified Successfully",
        description: `Your Aadhaar has been verified using ${method === 'blockchain' ? 'blockchain' : 'DigiLocker'}.`,
      });
    }, 2000);
  };

  const handleBillApiConnect = () => {
    // Simulate API connection
    setTimeout(() => {
      setBillApiConnected(true);
      toast({
        title: "API Connected Successfully",
        description: "Your bill payment accounts have been linked.",
      });
    }, 1500);
  };

  const onLoanSubmit = (data: z.infer<typeof loanApplicationSchema>) => {
    console.log("Loan Application:", data);
    const amount = parseFloat(data.loanAmount);
    
    if (amount > LOAN_THRESHOLD && !showExpensesForLoan) {
      setLoanAmount(amount);
      setShowExpensesForLoan(true);
      toast({
        title: "Additional Information Required",
        description: `For loans above ₹${(LOAN_THRESHOLD / 1000).toFixed(0)}K, please fill expenses & commodities details below.`,
        variant: "default",
      });
      return;
    }

    if (!completedSections.includes("loan")) {
      setCompletedSections([...completedSections, "loan"]);
    }
    toast({
      title: "Loan Application Submitted",
      description: "Your loan application has been submitted for review.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Complete Your Profile</h1>
        <p className="text-muted-foreground">Fill all sections to improve your credit score</p>
      </div>

      {/* Progress Bar */}
      <Card className="shadow-card mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Profile Completeness</span>
            <span className="text-sm font-bold text-primary">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        {profileSections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setSelectedSection(section.id)}
            className={cn(
              "relative p-4 rounded-lg border-2 transition-all text-left",
              selectedSection === section.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <div className="flex flex-col items-center gap-2">
            <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center",
                completedSections.includes(section.id) ? "bg-success" : "bg-muted"
              )}>
                <section.icon className={cn(
                  "h-6 w-6",
                  completedSections.includes(section.id) ? "text-white" : "text-muted-foreground"
                )} />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium">{section.title}</p>
                {completedSections.includes(section.id) ? (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <CheckCircle2 className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Pending</span>
                  </div>
                )}
              </div>
            </div>
            {index < profileSections.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border -translate-y-1/2" />
            )}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>
            {profileSections.find(s => s.id === selectedSection)?.title}
          </CardTitle>
          <CardDescription>
            Complete this section to improve your loan eligibility
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[600px] overflow-y-auto">
          {/* Basic Details Form */}
          {selectedSection === "basic" && (
            <Form {...basicForm}>
              <form onSubmit={basicForm.handleSubmit(onBasicSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={basicForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={basicForm.control}
                    name="fatherSpouseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's / Spouse's Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={basicForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={basicForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={basicForm.control}
                    name="aadhaar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhaar Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter 12-digit Aadhaar" maxLength={12} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={basicForm.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter 10-digit mobile" maxLength={10} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={basicForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email ID (Optional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={basicForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter complete address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={basicForm.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter district" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={basicForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={basicForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SC">SC</SelectItem>
                            <SelectItem value="ST">ST</SelectItem>
                            <SelectItem value="OBC">OBC</SelectItem>
                            <SelectItem value="Others">Others</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={basicForm.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={basicForm.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education Level (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="below-10th">Below 10th</SelectItem>
                          <SelectItem value="10th">10th Pass</SelectItem>
                          <SelectItem value="12th">12th Pass</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                          <SelectItem value="postgraduate">Post Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Save Basic Details</Button>
              </form>
            </Form>
          )}

          {/* Income Details Form */}
          {selectedSection === "income" && (
            <Form {...incomeForm}>
              <form onSubmit={incomeForm.handleSubmit(onIncomeSubmit)} className="space-y-6">
                <FormField
                  control={incomeForm.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Self-employed">Self-employed</SelectItem>
                          <SelectItem value="Salaried">Salaried</SelectItem>
                          <SelectItem value="Labour">Labour</SelectItem>
                          <SelectItem value="Unemployed">Unemployed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={incomeForm.control}
                  name="primaryIncomeSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Income Source *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Small Business, Daily Wage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={incomeForm.control}
                    name="monthlyIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Income (₹) *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={incomeForm.control}
                    name="secondaryIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Income (₹) (Optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={incomeForm.control}
                  name="householdMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Household Members Contributing to Income *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 Tip: Providing accurate income details helps improve your credit score accuracy and loan eligibility.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Upload Income Proof (Optional)</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <p className="text-xs text-muted-foreground">Upload payslip, sale receipt, or income certificate</p>
                </div>

                <Button type="submit" className="w-full">Save Income Details</Button>
              </form>
            </Form>
          )}

          {/* Bank Details Form */}
          {selectedSection === "bank" && (
            <Form {...bankForm}>
              <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="space-y-6">
                <FormField
                  control={bankForm.control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Must match Aadhaar name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bankForm.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bank name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={bankForm.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bankForm.control}
                    name="confirmAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Account Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Re-enter account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={bankForm.control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter 11-character IFSC" maxLength={11} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bankForm.control}
                    name="branchName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter branch name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={bankForm.control}
                  name="upiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UPI ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="yourname@upi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Passbook Copy / Bank Statement (Optional)</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                </div>

                <FormField
                  control={bankForm.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I authorize NBCFDC to verify my bank details *
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Save Bank Details</Button>
              </form>
            </Form>
          )}

          {/* Expenses & Commodities Form */}
          {selectedSection === "expenses" && (
            <div className="space-y-6">
              <Form {...expensesForm}>
                <form onSubmit={expensesForm.handleSubmit(onExpensesSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={expensesForm.control}
                      name="monthlyHouseholdExpenses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Household Expenses (₹) *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter amount" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={expensesForm.control}
                      name="monthlyBusinessExpenses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Business Expenses (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter amount" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={expensesForm.control}
                    name="monthlyLoanRepayments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Loan Repayments (₹) (if any)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={expensesForm.control}
                    name="commodities"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Commodities Owned (Optional)</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {["TV", "Refrigerator", "Washing Machine", "Vehicle", "Tractor", "Smartphone"].map((item) => (
                            <FormField
                              key={item}
                              control={expensesForm.control}
                              name="commodities"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], item])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bill Submission Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Utility Bill Verification
                    </h3>
                    
                    <Tabs defaultValue="upload" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Bills
                        </TabsTrigger>
                        <TabsTrigger value="api">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Connect via API
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="upload" className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload your recent utility bills for verification. This helps improve your credit score accuracy.
                          </p>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Electricity Bills (Last 3 months)</Label>
                              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
                              <p className="text-xs text-muted-foreground">Upload recent electricity bills</p>
                            </div>

                            <div className="space-y-2">
                              <Label>Mobile Recharge Bills</Label>
                              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
                              <p className="text-xs text-muted-foreground">Upload mobile recharge receipts</p>
                            </div>

                            <div className="space-y-2">
                              <Label>Water/Gas Bills (Optional)</Label>
                              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
                              <p className="text-xs text-muted-foreground">Upload other utility bills</p>
                            </div>

                            <Button type="button" variant="secondary" className="w-full">
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Verify Uploaded Bills
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="api" className="space-y-4">
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-start gap-3 mb-4">
                            <LinkIcon className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-primary mb-1">Connect Your Accounts</h4>
                              <p className="text-sm text-muted-foreground">
                                Give us secure access to automatically fetch your bill payment history. 
                                This is faster and more accurate than manual uploads.
                              </p>
                            </div>
                          </div>

                          {billApiConnected ? (
                            <div className="p-4 bg-success/10 border border-success rounded-lg">
                              <div className="flex items-center gap-2 text-success mb-2">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-semibold">Connected Successfully</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                We're now able to fetch your bill payment data automatically.
                              </p>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="mt-3"
                                onClick={() => setBillApiConnected(false)}
                              >
                                Disconnect
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex items-start space-x-3 p-3 rounded-md border">
                                <Checkbox id="api-consent" />
                                <div className="space-y-1 leading-none">
                                  <label htmlFor="api-consent" className="text-sm font-medium cursor-pointer">
                                    I authorize secure access to my utility bill accounts
                                  </label>
                                  <p className="text-xs text-muted-foreground">
                                    Your data is encrypted and will only be used for credit assessment
                                  </p>
                                </div>
                              </div>

                              <div className="grid gap-3">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  className="w-full justify-start"
                                  onClick={handleBillApiConnect}
                                >
                                  <Zap className="h-4 w-4 mr-2" />
                                  Connect Electricity Provider
                                </Button>
                                
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  className="w-full justify-start"
                                  onClick={handleBillApiConnect}
                                >
                                  <LinkIcon className="h-4 w-4 mr-2" />
                                  Connect Mobile Operator
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <FormField
                    control={expensesForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any additional information" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 Tip: This data helps us calculate your Income vs Expense Ratio for accurate credit assessment.
                    </p>
                  </div>

                  <Button type="submit" className="w-full">Save Expense Details</Button>
                </form>
              </Form>
            </div>
          )}

          {/* Submit Documents Form */}
          {selectedSection === "documents" && (
            <div className="space-y-6">
              {/* Aadhaar Verification Section */}
              <div className="p-6 bg-primary/5 border-2 border-primary/20 rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-1">Aadhaar Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Verify your Aadhaar card using secure blockchain technology or DigiLocker
                    </p>
                  </div>
                </div>

                {aadhaarVerified ? (
                  <div className="p-4 bg-success/10 border border-success rounded-lg">
                    <div className="flex items-center gap-2 text-success mb-2">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-semibold">Aadhaar Verified Successfully</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your Aadhaar has been verified and authenticated.
                      {digilockerConnected && " DigiLocker connected."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Aadhaar Number *</Label>
                      <Input 
                        type="text" 
                        placeholder="Enter 12-digit Aadhaar number" 
                        maxLength={12}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Button 
                        type="button" 
                        variant="default"
                        onClick={() => handleAadhaarVerification('blockchain')}
                        disabled={verifyingAadhaar}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {verifyingAadhaar ? "Verifying..." : "Verify via Blockchain"}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="secondary"
                        onClick={() => handleAadhaarVerification('digilocker')}
                        disabled={verifyingAadhaar}
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        {verifyingAadhaar ? "Connecting..." : "Connect DigiLocker"}
                      </Button>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Blockchain Verification:</strong> Uses decentralized technology for instant, secure verification.<br />
                        <strong>DigiLocker:</strong> Connect your DigiLocker account to fetch verified documents automatically.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Caste Certificate *</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <p className="text-xs text-muted-foreground">Required for eligibility verification</p>
                </div>

                <div className="space-y-2">
                  <Label>PAN Card (Optional)</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <p className="text-xs text-muted-foreground">Recommended for higher loan amounts</p>
                </div>

                <div className="space-y-2">
                  <Label>Address Proof (Optional)</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <p className="text-xs text-muted-foreground">Electricity bill, ration card, or voter ID</p>
                </div>

                <div className="space-y-2">
                  <Label>Business Proof (Optional)</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <p className="text-xs text-muted-foreground">Shop license, GST certificate, or business registration</p>
                </div>

                <div className="space-y-2">
                  <Label>Signature Upload *</Label>
                  <Input type="file" accept=".jpg,.jpeg,.png" />
                  <p className="text-xs text-muted-foreground">Clear image of your signature on white paper</p>
                </div>

                <div className="space-y-2">
                  <Label>Selfie for Verification (Optional)</Label>
                  <Input type="file" accept=".jpg,.jpeg,.png" />
                  <p className="text-xs text-muted-foreground">Recent photograph for identity verification</p>
                </div>
              </div>

              <div className="p-4 bg-accent/10 border border-accent rounded-lg">
                <p className="text-sm font-medium text-accent mb-2">📌 Important Guidelines:</p>
                <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
                  <li>All documents should be clear and readable</li>
                  <li>File size should not exceed 5MB per document</li>
                  <li>Accepted formats: PDF, JPG, PNG</li>
                  <li>Ensure all information is visible without blur</li>
                </ul>
              </div>

              <Button onClick={handleDocumentSubmit} className="w-full">Upload Documents</Button>
            </div>
          )}

          {/* Apply for Loan Form */}
          {selectedSection === "loan" && (
            <Form {...loanForm}>
              <form onSubmit={loanForm.handleSubmit(onLoanSubmit)} className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-sm font-medium text-primary mb-2">💰 Loan Eligibility Calculator</p>
                  <p className="text-xs text-muted-foreground">
                    Enter your desired loan amount and purpose. For amounts above ₹1 Lakh, additional expense details will be required.
                  </p>
                </div>

                <FormField
                  control={loanForm.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Loan Amount (₹) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter amount (e.g., 50000)" 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            const amount = parseFloat(e.target.value) || 0;
                            setLoanAmount(amount);
                          }}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        {loanAmount > LOAN_THRESHOLD ? (
                          <span className="text-accent font-medium">
                            ⚠️ Amount above ₹{(LOAN_THRESHOLD / 1000).toFixed(0)}K - Additional details required
                          </span>
                        ) : (
                          <span className="text-success font-medium">
                            ✓ Amount within basic eligibility
                          </span>
                        )}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loanForm.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose of Loan *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe how you will use this loan (e.g., business expansion, medical expenses, education)" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Show expense form if amount > threshold */}
                {showExpensesForLoan && loanAmount > LOAN_THRESHOLD && (
                  <div className="space-y-6 p-6 border-2 border-accent rounded-lg bg-accent/5">
                    <div className="flex items-center gap-2 text-accent">
                      <AlertCircle className="h-5 w-5" />
                      <h3 className="font-semibold">Additional Financial Information Required</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Monthly Household Expenses (₹) *</Label>
                        <Input type="number" placeholder="e.g., 15000" required />
                      </div>

                      <div className="space-y-2">
                        <Label>Monthly Business Expenses (₹)</Label>
                        <Input type="number" placeholder="e.g., 10000" />
                      </div>

                      <div className="space-y-2">
                        <Label>Existing Loan Repayments (₹/month)</Label>
                        <Input type="number" placeholder="e.g., 5000" />
                      </div>

                      <div className="space-y-2">
                        <Label>Electricity Bill (₹/month)</Label>
                        <Input type="number" placeholder="e.g., 1200" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Commodities Owned</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {["TV", "Refrigerator", "Washing Machine", "Two-Wheeler", "Four-Wheeler", "Tractor"].map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <Checkbox id={`loan-${item}`} />
                            <label htmlFor={`loan-${item}`} className="text-sm cursor-pointer">
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 Tip: Make sure all previous profile sections are completed for faster loan approval.
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Submit Loan Application
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
