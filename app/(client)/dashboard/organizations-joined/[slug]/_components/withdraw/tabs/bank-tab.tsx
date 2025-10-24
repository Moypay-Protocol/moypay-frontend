import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BankTab({
  initialData = {},
  onChange,
}: {
  initialData?: any;
  onChange: (data: any) => void;
}) {
  const [bank, setBank] = useState(initialData.bank || "bca");
  const [accountName, setAccountName] = useState(initialData.accountName || "");
  const [accountNumber, setAccountNumber] = useState(
    initialData.accountNumber || "",
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawVal = e.target.value.replace(/[^\d]/g, "");
    let maxLength = 20;

    switch (bank) {
      case "mandiri":
        maxLength = 13;
        break;
      case "bni":
      case "bca":
        maxLength = 10;
        break;
      case "bri":
        maxLength = 15;
        break;
    }

    if (rawVal.length > maxLength) {
      rawVal = rawVal.slice(0, maxLength);
    }
    setAccountNumber(rawVal);
  };

  useEffect(() => {
    onChange({ bank, accountNumber, accountName });
  }, [bank, accountNumber, accountName]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="account-name">Account Name</Label>
        <Input
          className="w-full h-12 mt-2"
          id="account-name"
          inputMode="text"
          placeholder="eg: John Doe"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="account-name">Account Number</Label>
        <div className="flex items-center w-full mt-2">
          <Select value={bank} onValueChange={setBank}>
            <SelectTrigger className="!bg-transparent rounded-tr-none rounded-br-none">
              <SelectValue placeholder="Select a Bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Banks</SelectLabel>
                <SelectItem defaultChecked value="bca">
                  BCA
                </SelectItem>
                <SelectItem value="bni">BNI</SelectItem>
                <SelectItem value="bri">BRI</SelectItem>
                <SelectItem value="mandiri">Mandiri</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            className="w-full h-12 rounded-tl-none rounded-bl-none border-l-0"
            id="account-number"
            inputMode="numeric"
            pattern="\d*"
            placeholder="0.0"
            value={accountNumber}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
}
