import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Home as HomeIcon, 
  Wallet, 
  FileText, 
  CreditCard,
  CheckCircle2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const profileSections = [
  { id: "basic", title: "Basic Details", icon: User, completed: true },
  { id: "income", title: "Income Details", icon: Wallet, completed: false },
  { id: "bank", title: "Bank Details", icon: CreditCard, completed: true },
  { id: "expenses", title: "Expenses & Commodities", icon: HomeIcon, completed: false },
  { id: "documents", title: "Submit Documents", icon: FileText, completed: false },
];

const Profile = () => {
  const [selectedSection, setSelectedSection] = useState("basic");
  const completedCount = profileSections.filter(s => s.completed).length;
  const progressPercentage = (completedCount / profileSections.length) * 100;

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
                section.completed ? "bg-success" : "bg-muted"
              )}>
                <section.icon className={cn(
                  "h-6 w-6",
                  section.completed ? "text-white" : "text-muted-foreground"
                )} />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium">{section.title}</p>
                {section.completed ? (
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
        <CardContent>
          {selectedSection === "basic" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Basic personal information form will appear here with fields like name, age, gender, address, family details, etc.
              </p>
              <Button>Save Basic Details</Button>
            </div>
          )}
          
          {selectedSection === "income" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Income information form with monthly income, income sources, stability indicators, etc.
              </p>
              <Button>Save Income Details</Button>
            </div>
          )}
          
          {selectedSection === "bank" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Bank account details form with account number, IFSC, UPI ID, verification status, etc.
              </p>
              <Button>Save Bank Details</Button>
            </div>
          )}
          
          {selectedSection === "expenses" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Monthly expenses and commodity usage form with utility bills, household expenses, etc.
              </p>
              <Button>Save Expense Details</Button>
            </div>
          )}
          
          {selectedSection === "documents" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Document upload section for Aadhaar, PAN, caste certificate, income proof, utility bills, etc.
              </p>
              <Button>Upload Documents</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
