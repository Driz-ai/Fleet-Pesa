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

