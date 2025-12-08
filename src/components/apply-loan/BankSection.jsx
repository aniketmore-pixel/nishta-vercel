// src/components/apply-loan/BankSection.jsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const BankSection = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
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
          control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
            name="ifscCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter 11-character IFSC"
                    maxLength={11}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
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
          control={form.control}
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

        {/* Consent */}
        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="consent-checkbox"
                  />
                </div>
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

        <Button type="submit" className="w-full">
          Save Bank Details
        </Button>
      </form>
    </Form>
  );
};
