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

export function VisaTab({
  initialData = {},
  onChange,
}: {
  initialData?: any;
  onChange: (data: any) => void;
}) {
  const [email, setEmail] = useState(initialData.email || "");
  const [expiration, setExpiration] = useState(initialData.expiration || "");
  const [cvc, setCvc] = useState(initialData.cvc || "");
  const [country, setCountry] = useState(initialData.country || "");

  useEffect(() => {
    onChange({ email, expiration, cvc, country });
  }, [email, expiration, cvc, country]);

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiration(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 4) value = value.slice(0, 4);
    setCvc(value);
  };

  return (
    <div className="flex flex-col gap-4 mt-3">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="example@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <fieldset className="border p-4 rounded-md">
        <legend className="text-sm font-medium px-2">Card Information</legend>

        <div className="flex gap-4 mt-2">
          <div className="flex-1">
            <Label className="mb-2" htmlFor="expiration">
              Expiration Date
            </Label>
            <Input
              className="mt-1"
              id="expiration"
              inputMode="numeric"
              maxLength={5}
              placeholder="MM/YY"
              value={expiration}
              onChange={handleExpirationChange}
            />
          </div>

          <div className="flex-1">
            <Label className="mb-2" htmlFor="cvc">
              CVC
            </Label>
            <Input
              className="mt-1"
              id="cvc"
              inputMode="numeric"
              maxLength={4}
              placeholder="123"
              value={cvc}
              onChange={handleCvcChange}
            />
          </div>
        </div>
      </fieldset>

      <div className="flex-1">
        <Label htmlFor="country">Country</Label>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="!bg-transparent w-full mt-2">
            <SelectValue placeholder="Select a Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Countries</SelectLabel>
              <SelectItem value="indonesia">Indonesia</SelectItem>
              <SelectItem value="malaysia">Malaysia</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
