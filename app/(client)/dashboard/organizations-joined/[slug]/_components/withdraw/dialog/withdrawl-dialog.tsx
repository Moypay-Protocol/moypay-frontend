import React, { useState, useEffect } from "react";
import { Building, CardSim, Flag, Plus, Trash2 } from "lucide-react";

import { VisaTab } from "../tabs/visa-tab";
import { BankTab } from "../tabs/bank-tab";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function WithdrawlDialog({
  setWithdrawMethod,
  initialMethod,
  open,
  onOpenChange,
}: {
  setWithdrawMethod: any;
  initialMethod?: { type: "visa" | "bank"; data: any };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [visaData, setVisaData] = useState(
    initialMethod?.type === "visa" ? initialMethod.data : {},
  );
  const [bankData, setBankData] = useState(
    initialMethod?.type === "bank" ? initialMethod.data : {},
  );

  useEffect(() => {
    const stored = localStorage.getItem("withdrawMethod");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        setWithdrawMethod(parsed);
      } catch (e) {
        throw e;
      }
    }
  }, []);

  const isVisaValid =
    visaData.email && visaData.expiration && visaData.cvc && visaData.country;
  const isBankValid = bankData.bank && bankData.accountNumber;
  const isFormValid =
    initialMethod?.type === "bank"
      ? isBankValid
      : initialMethod?.type === "visa"
        ? isVisaValid
        : bankData?.bank
          ? isBankValid
          : isVisaValid;

  const handleAddMethod = () => {
    const isEditing = Boolean(initialMethod);
    let type: "visa" | "bank";

    if (isEditing) {
      type = initialMethod!.type;
    } else {
      type = bankData?.bank ? "bank" : "visa";
    }

    const data = type === "bank" ? bankData : visaData;

    if (
      (type === "visa" && !isVisaValid) ||
      (type === "bank" && !isBankValid)
    ) {
      alert("Please fill in all required fields before saving.");

      return;
    }

    const method = { type, data };

    localStorage.setItem("withdrawMethod", JSON.stringify(method));
    setWithdrawMethod(method);
    onOpenChange?.(false);
  };

  const handleRemoveMethod = () => {
    localStorage.removeItem("withdrawMethod");
    setWithdrawMethod(null);
    onOpenChange?.(false);
  };

  const renderTabs = () => {
    if (!initialMethod) {
      return (
        <Tabs defaultValue="visa">
          <TabsList className="h-12 w-full">
            <TabsTrigger value="visa">
              <CardSim /> Visa
            </TabsTrigger>
            <TabsTrigger value="bank">
              <Building /> Bank
            </TabsTrigger>
          </TabsList>
          <TabsContent value="visa">
            <VisaTab initialData={{}} onChange={setVisaData} />
          </TabsContent>
          <TabsContent value="bank">
            <BankTab initialData={{}} onChange={setBankData} />
          </TabsContent>
        </Tabs>
      );
    }

    if (initialMethod.type === "visa") {
      return (
        <VisaTab initialData={initialMethod.data} onChange={setVisaData} />
      );
    }

    if (initialMethod.type === "bank") {
      return (
        <BankTab initialData={initialMethod.data} onChange={setBankData} />
      );
    }

    return null;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {!initialMethod && (
        <AlertDialogTrigger asChild>
          <Button
            className="w-full justify-center mt-5"
            size="sm"
            variant="ghost"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Withdrawl Method
          </Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Withdrawl Method
          </AlertDialogTitle>
          <AlertDialogDescription>
            {initialMethod
              ? "Edit your withdrawal method or remove it to select another."
              : "Select withdrawal method to convert crypto to fiat currency."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex w-full flex-col gap-6 mt-4">{renderTabs()}</div>

        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            {initialMethod && (
              <Button variant="destructive" onClick={handleRemoveMethod}>
                <Trash2 className="w-4 h-4 mr-1" /> Remove
              </Button>
            )}
          </div>
          <Button disabled={!isFormValid} onClick={handleAddMethod}>
            {initialMethod ? "Update Method" : "Add Method"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
