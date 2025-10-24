// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Settings,
//   AlertCircle,
//   CheckCircle2,
//   Info,
//   Fuel,
//   Save,
// } from "lucide-react";
// import Image from "next/image";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import TransactionDialog from "@/components/dialog/dialog-transactions";
// import { formatCompactNumber } from "@/lib/helper/number";
// import { type EarnData } from "@/data/earn.data";

// interface AutoEarnSettingsDialogProps {
//   currentThreshold: string;
//   currentProtocol: EarnData;
//   currentSalary: string;
//   organizationAddress: string;
//   onSuccess?: () => void;
//   trigger?: React.ReactNode;
// }

// type HexAddress = `0x${string}`;

// const AutoEarnSettingsDialog: React.FC<AutoEarnSettingsDialogProps> = ({
//   currentThreshold,
//   currentProtocol,
//   currentSalary,
//   organizationAddress,
//   onSuccess,
//   trigger,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [transactionOpen, setTransactionOpen] = useState(false);
//   const [threshold, setThreshold] = useState<string>("");
//   const [selectedProtocol, setSelectedProtocol] =
//     useState<EarnData>(currentProtocol);
//   const [selectedToken] = useState<string>("USDC");

//   // Initialize with current values when dialog opens
//   useEffect(() => {
//     if (isOpen) {
//       setThreshold(currentThreshold);
//       setSelectedProtocol(currentProtocol);
//     }
//   }, [isOpen, currentThreshold, currentProtocol]);

//   // Mock hooks - replace with actual implementation
//   const mockMutation = {
//     isPending: false,
//     isSuccess: false,
//     isError: false,
//     error: null,
//     mutateAsync: async (params: any) => {
//       // Replace with actual mutation logic
//       // console.log("Updating auto-earn settings:", params);
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//     },
//   };

//   const mockSteps = [
//     { id: 1, title: "Preparing transaction", status: "pending" },
//     { id: 2, title: "Updating threshold", status: "pending" },
//     { id: 3, title: "Confirming changes", status: "pending" },
//   ];

//   const isLoading = mockMutation.isPending;
//   const numericThreshold = parseFloat(threshold) || 0;
//   const isValidThreshold = threshold !== "" && numericThreshold > 0;
//   const isExceedsBalance = numericThreshold > Number(currentSalary);
//   const hasChanges =
//     threshold !== currentThreshold ||
//     selectedProtocol.address !== currentProtocol.address;

//   const handleConfirm = async () => {
//     if (!hasChanges || !isValidThreshold || isExceedsBalance) return;

//     setIsOpen(false);
//     setTransactionOpen(true);

//     try {
//       await mockMutation.mutateAsync({
//         organizationAddress: organizationAddress as HexAddress,
//         newThreshold: threshold,
//         newProtocolAddress: selectedProtocol.address as HexAddress,
//         onSuccess: () => {
//           onSuccess?.();
//         },
//       });
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handleDialogClose = () => {
//     setIsOpen(false);
//     setThreshold(currentThreshold);
//     setSelectedProtocol(currentProtocol);
//   };

//   const handleThresholdClick = (value: number): void => {
//     setThreshold(value.toString());
//   };

//   const handleMaxClick = (): void => {
//     if (currentSalary) {
//       setThreshold(currentSalary.toString());
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     let value = e.target.value;

//     value = value.replace(/[^0-9.]/g, "");

//     const decimalCount = (value.match(/\./g) || []).length;

//     if (decimalCount > 1) {
//       return;
//     }

//     const parts = value.split(".");

//     if (parts[1] && parts[1].length > 2) {
//       value = parts[0] + "." + parts[1].substring(0, 2);
//     }

//     if (value.length > 1 && value[0] === "0" && value[1] !== ".") {
//       value = value.substring(1);
//     }

//     setThreshold(value);
//   };

//   const getDisplayValue = (): string => {
//     if (threshold === "") return "";

//     return `$${threshold}`;
//   };

//   const displayValue = getDisplayValue();
//   const quickAmounts: number[] = [100, 500, 1000];

//   return (
//     <>
//       <TransactionDialog
//         errorMessage={mockMutation.error?.message}
//         isOpen={transactionOpen}
//         status={
//           mockMutation.isSuccess
//             ? "success"
//             : mockMutation.isError
//               ? "failed"
//               : "pending"
//         }
//         steps={mockSteps}
//         txHash={"0x1234567890abcdef" as HexAddress}
//         onClose={() => setTransactionOpen(false)}
//       />

//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogTrigger asChild>
//           {trigger || (
//             <Button className="flex items-center justify-center gap-2">
//               <Settings className="w-4 h-4" />
//               Settings
//             </Button>
//           )}
//         </DialogTrigger>

//         <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Settings className="h-5 w-5" />
//               Auto Earn Settings
//             </DialogTitle>
//             <p className="text-sm text-muted-foreground">
//               Adjust your auto-earn threshold and protocol preferences
//             </p>
//           </DialogHeader>

//           <div className="space-y-6">
//             {/* Current Status */}
//             <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <div className="w-3 h-3 rounded-full bg-green-500" />
//                 <span className="text-sm font-medium">
//                   Auto Earn is currently{" "}
//                   <span className="text-green-600">Active</span>
//                 </span>
//               </div>
//             </div>

//             {/* Current Protocol */}
//             <div className="space-y-4">
//               <Label className="text-base font-medium">
//                 Investment Protocol
//               </Label>
//               <div className="p-4 border-2 border-primary/50 rounded-xl bg-primary/5 relative">
//                 <div className="absolute top-2 right-2">
//                   <div className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
//                     Current
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="relative">
//                     <Image
//                       alt={selectedProtocol.name}
//                       className="w-10 h-10 rounded-full"
//                       height={40}
//                       src={selectedProtocol.iconUrl}
//                       width={40}
//                     />
//                     <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
//                       <CheckCircle2 className="w-2.5 h-2.5 text-white" />
//                     </div>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="font-semibold text-base">
//                       {selectedProtocol.name}
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       Verified protocol
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <div>
//                     <div className="text-2xl font-bold text-green-600">
//                       {selectedProtocol.apy}%
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       Current APY
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-lg font-medium">
//                       ${formatCompactNumber(selectedProtocol.tvl)}
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                       Total Value Locked
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Threshold Setting */}
//             <div className="space-y-4">
//               <Label className="text-base font-medium">
//                 Investment Threshold
//               </Label>
//               <div className="p-6 bg-gradient-to-br from-background via-background/95 to-muted/30 rounded-2xl border">
//                 <div className="flex items-center justify-between mb-6">
//                   <span className="text-sm font-medium flex items-center gap-2">
//                     New Threshold Amount
//                   </span>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded-full">
//                       Current: ${formatCompactNumber(currentThreshold || 0)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="relative mb-6">
//                   <input
//                     aria-label="Threshold amount"
//                     autoComplete="off"
//                     autoCorrect="off"
//                     className={`w-full bg-transparent text-4xl font-light text-center px-4 py-6 border-none outline-none ring-0 placeholder:text-gray-500 focus:placeholder:text-gray-400 transition-all ${
//                       isExceedsBalance ? "text-red-400" : "text-primary"
//                     }`}
//                     inputMode="decimal"
//                     pattern="[0-9]*[.]?[0-9]*"
//                     placeholder="$0.00"
//                     spellCheck={false}
//                     type="text"
//                     value={displayValue}
//                     onChange={handleInputChange}
//                   />
//                   {threshold && !isExceedsBalance && (
//                     <div className="text-center text-sm text-green-600 mt-2">
//                       Auto-invest when balance reaches this amount
//                     </div>
//                   )}
//                 </div>

//                 {isExceedsBalance && (
//                   <div className="flex items-center justify-center gap-2 text-red-400 text-sm mb-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
//                     <AlertCircle className="w-4 h-4" />
//                     <span>Amount exceeds available balance</span>
//                   </div>
//                 )}

//                 <div className="flex flex-wrap justify-center gap-3 mb-6">
//                   {quickAmounts.map((amt) => (
//                     <Button
//                       key={amt}
//                       className="px-4 py-2 text-sm font-medium bg-muted/70 hover:bg-muted transition-colors rounded-xl"
//                       disabled={
//                         typeof currentSalary === "number"
//                           ? amt > currentSalary
//                           : false
//                       }
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => handleThresholdClick(amt)}
//                     >
//                       ${amt.toLocaleString()}
//                     </Button>
//                   ))}
//                   <Button
//                     className="px-4 py-2 text-sm font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-colors rounded-xl"
//                     size="sm"
//                     variant="ghost"
//                     onClick={handleMaxClick}
//                   >
//                     MAX
//                   </Button>
//                 </div>

//                 <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-dashed">
//                   <div className="flex items-center gap-2">
//                     <Image
//                       alt="USDC Token"
//                       className="w-5 h-5"
//                       height={20}
//                       src="/usdc.png"
//                       width={20}
//                     />
//                     <span className="font-medium text-sm">{selectedToken}</span>
//                     <span className="text-xs text-muted-foreground">
//                       • ERC-20
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <Fuel className="w-4 h-4" />
//                     <span className="text-sm">~$0.10 gas</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Info Box */}
//             <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
//               <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
//                   How Threshold Works
//                 </h4>
//                 <p className="text-sm text-blue-700 dark:text-blue-300">
//                   When your salary balance reaches the threshold amount, it will
//                   be automatically invested into the selected protocol. This
//                   helps optimize your earnings through compound interest.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between gap-3 pt-4">
//             <Button
//               disabled={isLoading}
//               variant="outline"
//               onClick={handleDialogClose}
//             >
//               Cancel
//             </Button>

//             <Button
//               className="flex items-center gap-2"
//               disabled={
//                 !hasChanges ||
//                 !isValidThreshold ||
//                 isExceedsBalance ||
//                 isLoading
//               }
//               onClick={handleConfirm}
//             >
//               <Save className="w-4 h-4" />
//               {!hasChanges
//                 ? "No Changes"
//                 : !isValidThreshold
//                   ? "Enter Threshold"
//                   : isExceedsBalance
//                     ? "Exceeds Balance"
//                     : "Update Settings"}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default AutoEarnSettingsDialog;
