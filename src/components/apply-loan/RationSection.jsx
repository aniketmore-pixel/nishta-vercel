// src/components/apply-loan/RationSection.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle2 } from "lucide-react";

export const RationSection = ({
  rationFetched,
  rationDetails,
  digilockerConnected,
  seccFetched,
  seccDetails,
  fetchingSECC, // currently unused, but kept for future extension
  fetchingRation,
  rationNumber,
  setRationNumber,
  rationError,
  handleFetchRationDetails,
}) => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg">
        {/* HEADER */}
        <div className="flex items-start gap-3 mb-4">
          <Shield className="h-6 w-6 text-primary mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-primary mb-1">
              Ration Card
            </h3>
          </div>
        </div>

        {/* AFTER FETCH */}
        {rationFetched ? (
          <div className="space-y-6">
            <div className="p-4 bg-muted border border-success rounded-lg">
              <div className="flex items-center gap-2 text-success mb-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">
                  Ration Details Fetched Successfully
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your ration card details have been successfully fetched.
                {digilockerConnected && " DigiLocker connected."}
              </p>
            </div>

            {/* Ration Details */}
            <div className="p-4 space-y-4">
              <h4 className="font-semibold text-primary text-md">
                Household Details
              </h4>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Household Size</Label>
                  <Input
                    value={rationDetails.householdSize}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <Label>Household Dependents</Label>
                  <Input
                    value={rationDetails.dependentCount}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <Label>Earners Count</Label>
                  <Input
                    value={rationDetails.earnersCount}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <Label>Dependency Ratio</Label>
                  <Input
                    value={rationDetails.dependencyRatio}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <Label>Ration Card Category</Label>
                  <Input
                    value={rationDetails.rationCategory}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* SECC SECTION */}
            <div className="p-4 space-y-4">
              <h4 className="font-semibold text-primary text-md">
                SECC Category
              </h4>

              {seccFetched && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>SECC Category</Label>
                    <Input
                      value={seccDetails.category}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  {/* If later you want score, add here */}
                </div>
              )}
            </div>
          </div>
        ) : (
          // BEFORE FETCH
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Ration Card Number *</Label>

              <Input
                type="text"
                placeholder="Enter 12-digit Ration Card Number"
                maxLength={12}
                value={rationNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").trim();
                  setRationNumber(val);
                }}
              />

              {rationError && (
                <p className="text-red-500 text-sm">{rationError}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <Button
                type="button"
                variant="default"
                onClick={handleFetchRationDetails}
                disabled={fetchingRation}
              >
                <Shield className="h-4 w-4 mr-2" />
                {fetchingRation ? "Fetching..." : "Fetch Ration Details"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
