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

  if (submitted) {
    return (
      <main className="driver-remittance-page">
        <section className="remittance-success">
          <div className="success-icon">
            <CheckCircle2 size={34} />
          </div>

          <p className="eyebrow">REMITTANCE SUBMITTED</p>

          <h1>KES {parsedAmount.toLocaleString()}</h1>

          <p className="success-copy">
            Your remittance for <strong>KDG 482P</strong> has been recorded.
          </p>

          <div className="success-details">
            <div>
              <span>Vehicle</span>
              <strong>KDG 482P</strong>
            </div>

            <div>
              <span>Payment method</span>
              <strong>
                {
                  paymentMethods.find(
                    (item) => item.id === paymentMethod
                  )?.label
                }
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong className={`status-text ${status}`}>
                {status === "paid"
                  ? "Paid in full"
                  : status === "short"
                    ? "Short remittance"
                    : "Above target"}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setSubmitted(false);
              setAmount("");
              setReference("");
              setNotes("");
            }}
          >
            Enter another remittance
          </button>
        </section>
      </main>
    );
  }

}