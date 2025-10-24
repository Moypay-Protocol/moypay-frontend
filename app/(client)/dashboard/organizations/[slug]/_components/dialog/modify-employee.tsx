"use client";

import React, { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { Loader2, User, AlertCircle, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiTransactionDialog from "@/components/dialog/dialog-multi-transactions";
import { useModifyEmployeeMulti } from "@/hooks/mutation/contract/use-modify-employee-multi";

type HexAddress = `0x${string}`;

interface ModifyEmployeeProps {
  onSuccess?: () => void;
  organizationAddress: HexAddress;
  employeeAddress: HexAddress;
  currentSalary: number;
  currentStatus: boolean;
  currentName: string;
  refetch: () => void;
  trigger?: React.ReactNode;
}

const ModifyEmployee: React.FC<ModifyEmployeeProps> = ({
  onSuccess,
  organizationAddress,
  employeeAddress,
  currentSalary,
  currentStatus,
  currentName,
  refetch,
  trigger,
}) => {
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(currentName || "");
  const [salary, setSalary] = useState(currentSalary.toString());
  const [status, setStatus] = useState(currentStatus);
  const [isNow, setIsNow] = useState(true);
  const [startStreamDate, setStartStreamDate] = useState<Date | undefined>(
    undefined,
  );
  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [transactionOpen, setTransactionOpen] = useState(false);
  const { transactions, mutation: modifyMutation } = useModifyEmployeeMulti();

  const isLoading = modifyMutation.isPending;
  const MAX_NAME_LENGTH = 15;
  const MIN_NAME_LENGTH = 2;

  const nameValidation = useMemo(() => {
    if (!name) {
      return { isValid: true, error: "" };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < MIN_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Name must be at least ${MIN_NAME_LENGTH} characters`,
      };
    }

    if (name.length > MAX_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Name must not exceed ${MAX_NAME_LENGTH} characters`,
      };
    }

    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
      return {
        isValid: false,
        error:
          "Name can only contain letters, numbers, spaces, hyphens, and underscores",
      };
    }

    return { isValid: true, error: "" };
  }, [name]);
  const isFormChanged = useMemo(
    () =>
      salary !== currentSalary.toString() ||
      status !== currentStatus ||
      name !== (currentName || ""),
    [salary, status, name, currentSalary, currentStatus, currentName],
  );

  const salaryValidation = useMemo(() => {
    if (!salary) {
      return { isValid: true, error: "" };
    }

    if (isNaN(Number(salary)) || Number(salary) <= 0) {
      return { isValid: false, error: "Salary must be a positive number" };
    }

    return { isValid: true, error: "" };
  }, [salary]);

  const startStreamTimestamp = useMemo(() => {
    if (isNow) {
      return Math.floor(Date.now() / 1000);
    }

    if (!startStreamDate) return undefined;

    const dateWithTime = new Date(startStreamDate);

    dateWithTime.setHours(
      parseInt(selectedHour),
      parseInt(selectedMinute),
      0,
      0,
    );

    return Math.floor(dateWithTime.getTime() / 1000);
  }, [isNow, startStreamDate, selectedHour, selectedMinute]);

  const dateValidation = useMemo(() => {
    if (isNow || !startStreamDate) {
      return { isValid: true, error: "" };
    }

    const now = new Date();
    const selectedDateTime = new Date(startStreamDate);

    selectedDateTime.setHours(
      parseInt(selectedHour),
      parseInt(selectedMinute),
      0,
      0,
    );

    if (selectedDateTime <= now) {
      return {
        isValid: false,
        error: "Start date and time must be in the future",
      };
    }

    return { isValid: true, error: "" };
  }, [isNow, startStreamDate, selectedHour, selectedMinute]);

  const isFormValid =
    nameValidation.isValid &&
    salaryValidation.isValid &&
    isFormChanged &&
    dateValidation.isValid &&
    (isNow || startStreamDate);

  const handleModifyEmployee = async () => {
    if (!address || !organizationAddress) {
      return;
    }

    setIsOpen(false);
    setTransactionOpen(true);

    try {
      await modifyMutation.mutateAsync({
        employeeAddress,
        newName: name !== (currentName || "") ? name : undefined,
        currentName,
        newSalary:
          salary !== currentSalary.toString() ? Number(salary) : undefined,
        currentSalary,
        newStatus: status !== currentStatus ? status : undefined,
        currentStatus,
        startStream: startStreamTimestamp,
        isNow,
        organizationAddress,
      });

      setName(currentName || "");
      setSalary(currentSalary.toString());
      setStatus(currentStatus);
      onSuccess?.();
      refetch();
    } catch (error) {
      throw error;
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setName(currentName || "");
    setSalary(currentSalary.toString());
    setStatus(currentStatus);
    setIsNow(true);
    setStartStreamDate(undefined);
    setSelectedHour("12");
    setSelectedMinute("00");
  };

  const handleIsNowChange = (checked: boolean) => {
    setIsNow(checked);
    if (checked) {
      setStartStreamDate(undefined);
      setSelectedHour("12");
      setSelectedMinute("00");
    }
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");

    return { value: hour, label: hour };
  });

  const minuteOptions = Array.from({ length: 12 }, (_, i) => {
    const minute = (i * 5).toString().padStart(2, "0");

    return { value: minute, label: minute };
  });

  const formatDateTime = (date: Date, hour: string, minute: string) => {
    const dateWithTime = new Date(date);

    dateWithTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

    return format(dateWithTime, "PPP 'at' HH:mm");
  };

  return (
    <>
      <MultiTransactionDialog
        description="Please wait while we update the employee information"
        isOpen={transactionOpen}
        title="Modifying Employee"
        transactions={transactions}
        onClose={() => setTransactionOpen(false)}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button className="w-auto justify-start" size="sm">
              Modify Employee
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Modify Employee
            </DialogTitle>
            <DialogDescription>
              Edit the salary and status of the employee.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="emp-name">Employee Name</Label>
                <span
                  className={`text-xs ${
                    name.length > MAX_NAME_LENGTH
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {name.length}/{MAX_NAME_LENGTH}
                </span>
              </div>
              <Input
                className={`h-12 ${!nameValidation.isValid ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                id="emp-name"
                maxLength={MAX_NAME_LENGTH}
                placeholder="Enter employee name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {!nameValidation.isValid && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{nameValidation.error}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emp-salary">Salary</Label>
              <Input
                className={`h-12 ${!salaryValidation.isValid ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                id="emp-salary"
                placeholder="Enter new salary"
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
              {!salaryValidation.isValid && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{salaryValidation.error}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={status}
                id="emp-status"
                onCheckedChange={(checked) => setStatus(checked === true)}
              />
              <Label
                className="text-sm font-normal cursor-pointer"
                htmlFor="emp-status"
              >
                Active Status
              </Label>
            </div>

            {salary !== currentSalary.toString() && (
              <div className="space-y-3">
                <Label>Salary Stream Start</Label>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={isNow}
                    id="start-now"
                    onCheckedChange={handleIsNowChange}
                  />
                  <Label
                    className="text-sm font-normal cursor-pointer"
                    htmlFor="start-now"
                  >
                    Start streaming now
                  </Label>
                </div>

                {!isNow && (
                  <div className="space-y-2">
                    <Label htmlFor="start-date">
                      Schedule Start Date & Time
                    </Label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className={`h-12 w-full justify-start text-left font-normal ${
                            !startStreamDate ? "text-muted-foreground" : ""
                          } ${!dateValidation.isValid ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          variant="outline"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {startStreamDate ? (
                            formatDateTime(
                              startStreamDate,
                              selectedHour,
                              selectedMinute,
                            )
                          ) : (
                            <span>Pick a start date and time</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <div className="p-3">
                          <CalendarComponent
                            initialFocus
                            disabled={(date) => {
                              const today = new Date();

                              today.setHours(0, 0, 0, 0);

                              return date < today;
                            }}
                            mode="single"
                            selected={startStreamDate}
                            onSelect={setStartStreamDate}
                          />

                          {startStreamDate && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  Time
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <Label className="text-xs" htmlFor="hour">
                                    Hour
                                  </Label>
                                  <Select
                                    value={selectedHour}
                                    onValueChange={setSelectedHour}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {hourOptions.map((hour) => (
                                        <SelectItem
                                          key={hour.value}
                                          value={hour.value}
                                        >
                                          {hour.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex-1">
                                  <Label className="text-xs" htmlFor="minute">
                                    Minute
                                  </Label>
                                  <Select
                                    value={selectedMinute}
                                    onValueChange={setSelectedMinute}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {minuteOptions.map((minute) => (
                                        <SelectItem
                                          key={minute.value}
                                          value={minute.value}
                                        >
                                          {minute.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {!dateValidation.isValid && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>{dateValidation.error}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-row justify-between sm:flex-row sm:justify-between w-full items-center">
            <Button
              disabled={isLoading}
              variant="outline"
              onClick={handleDialogClose}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading || !isFormValid}
              onClick={handleModifyEmployee}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModifyEmployee;
