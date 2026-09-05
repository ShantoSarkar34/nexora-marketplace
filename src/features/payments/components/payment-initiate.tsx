// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { CreditCard, Smartphone } from "lucide-react";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import type { PaymentMethod } from "@/types/payment";

// interface Props {
//   amount: number;
//   contractId: string;
// }

// export function PaymentInitiate({ amount, contractId }: Props) {
//   const router = useRouter();
//   const [method, setMethod] = useState<PaymentMethod>("STRIPE");
//   const [isProcessing, setIsProcessing] = useState(false);

//   async function handlePay() {
//     setIsProcessing(true);
//     // Track B: replace with real API call -> services/payments.ts:initiatePayment(contractId, method)
//     // then redirect to the provider's hosted checkout (Stripe) and let the
//     // backend-verified webhook determine final status — never trust the
//     // frontend redirect alone.
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     setIsProcessing(false);
//     router.push(`/client/payments/success?contractId=${contractId}`);
//   }

//   return (
//     <Card>
//       <h3>Choose a payment method</h3>
//       <div className="mt-4 grid grid-cols-2 gap-3">
//         <button
//           onClick={() => setMethod("STRIPE")}
//           className={cn(
//             "flex flex-col items-center gap-2 rounded-md border p-4",
//             method === "STRIPE"
//               ? "border-brand-600 bg-brand-50"
//               : "border-border",
//           )}
//         >
//           <CreditCard className="text-text-primary h-5 w-5" />
//           <span className="text-text-primary text-sm font-medium">
//             Card (Stripe)
//           </span>
//         </button>
//         <button
//           onClick={() => setMethod("BKASH")}
//           className={cn(
//             "flex flex-col items-center gap-2 rounded-md border p-4",
//             method === "BKASH"
//               ? "border-brand-600 bg-brand-50"
//               : "border-border",
//           )}
//         >
//           <Smartphone className="text-text-primary h-5 w-5" />
//           <span className="text-text-primary text-sm font-medium">bKash</span>
//         </button>
//       </div>
//       <div className="border-border mt-5 flex items-center justify-between border-t pt-4">
//         <span className="text-text-secondary text-sm">Total due</span>
//         <span className="text-text-primary text-lg font-semibold">
//           ${amount}
//         </span>
//       </div>
//       <Button
//         className="mt-4 w-full"
//         onClick={handlePay}
//         isLoading={isProcessing}
//       >
//         Pay ${amount}
//       </Button>
//     </Card>
//   );
// }
