import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Demo data – in real app, you will fetch this from API
const applicationsData = [
  {
    id: "#NB2025001234",
    appliedDate: "15 Sep 2025",
    schemeName: "Micro Business Loan – General Scheme",
    status: "Approved", // "Approved" | "Rejected" | "Under Review"
    loanAmountApplied: "₹3,00,000",
    tenureApplied: "36 months",
    loanAmountApproved: "₹2,80,000",
    tenureApproved: "30 months",
    physicalInterventionRequired: false,
    offerStatus: "Pending", // "Pending" | "Accepted" | "Rejected"
  },
  {
    id: "#NB2025001567",
    appliedDate: "28 Sep 2025",
    schemeName: "Education Support Loan",
    status: "Under Review",
    loanAmountApplied: "₹2,00,000",
    tenureApplied: "24 months",
    loanAmountApproved: null,
    tenureApproved: null,
    physicalInterventionRequired: true,
    physicalInterventionNote:
      "Field officer visit scheduled for income and business verification.",
    offerStatus: null,
  },
  {
    id: "#NB2025010891",
    appliedDate: "10 Aug 2025",
    schemeName: "Small Entrepreneur Loan",
    status: "Rejected",
    loanAmountApplied: "₹5,00,000",
    tenureApplied: "48 months",
    loanAmountApproved: null,
    tenureApproved: null,
    rejectionReason:
      "Income level below minimum threshold for requested loan amount. You may re-apply with lower amount or updated income documents.",
    physicalInterventionRequired: false,
    offerStatus: null,
  },
];

const getStatusBadgeClasses = (status) => {
  switch (status) {
    case "Approved":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "Rejected":
      return "bg-red-100 text-red-700 border border-red-200";
    case "Under Review":
      return "bg-amber-100 text-amber-700 border border-amber-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status) => {
  if (status === "Approved") {
    return <CheckCircle2 className="h-3 w-3 mr-1" />;
  }
  if (status === "Rejected") {
    return <XCircle className="h-3 w-3 mr-1" />;
  }
  if (status === "Under Review") {
    return <Clock className="h-3 w-3 mr-1" />;
  }
  return null;
};

const getStatusProgress = (status) => {
  if (status === "Approved") return 100;
  if (status === "Rejected") return 100;
  if (status === "Under Review") return 60;
  return 30;
};

const TrackApplication = () => {
  const [applications, setApplications] = useState(applicationsData);

  const handleOfferDecision = (id, decision) => {
    // decision: "Accepted" | "Rejected"
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, offerStatus: decision } : app
      )
    );

    // TODO: Call your backend API here with id + decision
    // await axios.post("/api/loan/offer-decision", { id, decision })
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Track Your Loan Applications
        </h1>
        <p className="text-muted-foreground">
          View the status of your applications, approved amounts and final
          offers.
        </p>
      </div>

      <div className="space-y-6">
        {applications.map((app) => {
          const progressValue = getStatusProgress(app.status);

          return (
            <Card key={app.id} className="shadow-card">
              <CardHeader className="border-b pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Loan Application
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Loan ID:{" "}
                      <span className="font-medium text-foreground">
                        {app.id}
                      </span>{" "}
                      • Applied on {app.appliedDate}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-1">
                      Scheme Applied:{" "}
                      <span className="font-medium text-foreground">
                        {app.schemeName}
                      </span>
                    </p>
                  </div>

                  <div className="text-right space-y-2">
                    <Badge className={getStatusBadgeClasses(app.status)}>
                      {getStatusIcon(app.status)}
                      {app.status}
                    </Badge>

                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground">
                        Loan Amount Applied
                      </p>
                      <p className="font-semibold text-primary">
                        {app.loanAmountApplied}
                      </p>
                    </div>

                    {app.loanAmountApproved && (
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground">
                          Loan Amount Approved
                        </p>
                        <p className="font-semibold text-emerald-600">
                          {app.loanAmountApproved}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <Progress value={progressValue} className="h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {app.status === "Approved" &&
                      "Your application has been approved. Please review and accept the final offer."}
                    {app.status === "Rejected" &&
                      "Your application has been rejected. See below for details."}
                    {app.status === "Under Review" &&
                      "Your application is being evaluated by the admin team."}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 pt-4">
                {/* Core Details */}
                <div className="grid gap-4 md:grid-cols-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Loan Amount Applied
                    </p>
                    <p className="font-medium">{app.loanAmountApplied}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Tenure Applied
                    </p>
                    <p className="font-medium">{app.tenureApplied}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Scheme Applied
                    </p>
                    <p className="font-medium">{app.schemeName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Loan Amount Approved
                    </p>
                    <p className="font-medium">
                      {app.loanAmountApproved || (
                        <span className="text-muted-foreground">Not decided</span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Tenure Approved
                    </p>
                    <p className="font-medium">
                      {app.tenureApproved || (
                        <span className="text-muted-foreground">Not decided</span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Final Offer Status
                    </p>
                    <p className="font-medium flex items-center gap-1">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      {app.offerStatus
                        ? app.offerStatus === "Accepted"
                          ? "Offer Accepted"
                          : "Offer Rejected"
                        : app.status === "Approved"
                        ? "Action Pending from You"
                        : "Not Applicable"}
                    </p>
                  </div>
                </div>

                {/* Physical Intervention Block */}
                {app.physicalInterventionRequired && (
                  <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-800 mb-1">
                        Physical Verification Required
                      </p>
                      <p className="text-amber-800/90">
                        {app.physicalInterventionNote ||
                          "A field officer will visit for physical verification as part of the assessment process."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {app.status === "Rejected" && app.rejectionReason && (
                  <div className="p-3 rounded-lg border border-red-200 bg-red-50 flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800 mb-1">
                        Reason for Rejection
                      </p>
                      <p className="text-red-800/90">{app.rejectionReason}</p>
                    </div>
                  </div>
                )}

                {/* Final Offer Actions (only if Approved) */}
                {app.status === "Approved" && (
                  <div className="flex flex-col gap-2 border-t pt-4 mt-2">
                    <p className="text-sm font-medium">
                      Final Offer Confirmation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Please review the approved loan amount and tenure. Once
                      you accept, the loan will be processed for disbursement.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-2">
                      <Button
                        size="sm"
                        className="border-none"
                        disabled={app.offerStatus === "Accepted"}
                        onClick={() =>
                          handleOfferDecision(app.id, "Accepted")
                        }
                      >
                        {app.offerStatus === "Accepted"
                          ? "Offer Accepted"
                          : "Accept Offer"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={app.offerStatus === "Rejected"}
                        onClick={() =>
                          handleOfferDecision(app.id, "Rejected")
                        }
                      >
                        {app.offerStatus === "Rejected"
                          ? "Offer Rejected"
                          : "Reject Offer"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TrackApplication;
