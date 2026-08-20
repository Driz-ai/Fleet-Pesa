import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Smartphone,
  Info,
  Wallet,
} from "lucide-react";
import "../styles/driver-remittance.css";

const paymentMethods = [
  {
    id: "mpesa",
    label: "M-Pesa",
    description: "Mobile money",
    icon: Smartphone,
  },
  {
    id: "cash",
    label: "Cash",
    description: "Cash payment",
    icon: Wallet,
  },
];

export default function DriverRemittance() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const expectedAmount = 3500;

  const parsedAmount = Number(amount) || 0;
  const balance = Math.max(expectedAmount - parsedAmount, 0);
  const shortfall = Math.max(expectedAmount - parsedAmount, 0);
  const overpayment = Math.max(parsedAmount - expectedAmount, 0);

  const status = useMemo(() => {
    if (!amount) return "pending";
    if (parsedAmount === expectedAmount) return "paid";
    if (parsedAmount < expectedAmount) return "short";
    return "over";
  }, [amount, parsedAmount]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!parsedAmount) return;

    console.log({
      amount: parsedAmount,
      paymentMethod,
      reference,
      notes,
      status,
    });

    setSubmitted(true);
  }

}