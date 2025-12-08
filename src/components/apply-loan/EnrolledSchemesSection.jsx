// src/components/apply-loan/EnrolledSchemesSection.jsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const EnrolledSchemesSection = ({ form, onSubmit }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="enrolledMgnrega"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enrolled in MGNREGA *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Yes / No" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enrolledPmUjjwala"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enrolled in PM Ujjwala Yojana *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Yes / No" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enrolledPmJay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enrolled in PM-JAY (Ayushman Bharat) *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Yes / No" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enrolledPensionScheme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enrolled in Pension Scheme *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Yes / No" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Enrolled Schemes
        </Button>
      </form>
    </Form>
  );
};
