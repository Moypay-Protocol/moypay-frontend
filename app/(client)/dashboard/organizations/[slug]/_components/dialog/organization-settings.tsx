"use client";

import { useState } from "react";
import { Settings, Check, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useSetPeriodTime } from "@/hooks/mutation/contract/use-set-period-time";
import { PERIOD_TIMES, PERIOD_LABELS } from "@/lib/constants";
import { getPeriodLabel } from "@/lib/helper/period";

interface OrganizationSettingsProps {
  organizationAddress: string;
  currentPeriodTime?: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function OrganizationSettings({
  organizationAddress,
  currentPeriodTime,
  trigger,
  onSuccess,
}: OrganizationSettingsProps) {
  const [open, setOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  const { steps, mutation, dialogStatus } = useSetPeriodTime();

  const currentPeriodLabel = currentPeriodTime
    ? getPeriodLabel(currentPeriodTime)
    : "Unknown";

  const periodOptions = Object.entries(PERIOD_TIMES).map(([key, value]) => ({
    value: value.toString(),
    label: PERIOD_LABELS[key as keyof typeof PERIOD_LABELS],
    key,
  }));

  const handleSubmit = async () => {
    if (!selectedPeriod || !organizationAddress) return;

    try {
      await mutation.mutateAsync({
        organizationAddress: organizationAddress as HexAddress,
        periodTime: parseInt(selectedPeriod),
        onSuccess: () => {
          onSuccess?.();
          setOpen(false);
          setSelectedPeriod("");
        },
      });
    } catch (error) {
      throw error;
    }
  };

  const resetDialog = () => {
    setSelectedPeriod("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!mutation.isPending) {
      setOpen(newOpen);
      if (!newOpen) {
        resetDialog();
      }
    }
  };

  const isFormValid = selectedPeriod && selectedPeriod !== currentPeriodTime;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Organization Settings
          </DialogTitle>
          <DialogDescription>
            Configure your organization&#39;s payment settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Current Payment Period
            </Label>
            <div className="flex items-center gap-2">
              <Badge className="capitalize" variant="secondary">
                {currentPeriodLabel}
              </Badge>
              <span className="text-sm text-muted-foreground">
                (
                {currentPeriodTime
                  ? `${Math.floor(parseInt(currentPeriodTime) / 86400)} days`
                  : "Unknown"}
                )
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium" htmlFor="period-select">
              New Payment Period
            </Label>
            <Select
              disabled={mutation.isPending}
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger id="period-select">
                <SelectValue placeholder="Select payment period" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem
                    key={option.key}
                    disabled={option.value === currentPeriodTime}
                    value={option.value}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {option.value === currentPeriodTime && (
                        <Badge className="ml-2 text-xs" variant="outline">
                          Current
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPeriod && selectedPeriod !== currentPeriodTime && (
              <p className="text-sm text-muted-foreground">
                Employees will be paid every{" "}
                {getPeriodLabel(selectedPeriod).toLowerCase()}
              </p>
            )}
          </div>

          {mutation.isPending && (
            <div className="space-y-3">
              <div className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.step}
                    className="flex items-center gap-2 text-sm"
                  >
                    {step.status === "loading" && (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    )}
                    {step.status === "success" && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                    {step.status === "error" && (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    {step.status === "idle" && (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                    )}
                    <span
                      className={step.status === "error" ? "text-red-500" : ""}
                    >
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>

              {steps.some((s) => s.status === "error") && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    {steps.find((s) => s.status === "error")?.error}
                  </p>
                </div>
              )}
            </div>
          )}

          {dialogStatus() === "success" && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Organization settings updated successfully!
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            disabled={mutation.isPending}
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={!isFormValid || mutation.isPending}
            onClick={handleSubmit}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Settings"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
