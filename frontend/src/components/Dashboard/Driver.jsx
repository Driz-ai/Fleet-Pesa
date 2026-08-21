import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Truck } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { StatusBadge } from "../shared/StatusBadge.jsx";
import { StatCard } from "../shared/StatCard";
import Avatar from "../shared/Avatar.jsx";
export default function Driver(){
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [amount,setAmount] = useState("")
    const [status,setStatus] = useState("idle")
    const [paymentPhone, setPaymentPhone] = useState(user?.phone || "0712345678")
    const quickAmounts = [1500,3000,4500]

    function handleAmountChange(event){
      const newAmount = event.target.value.replace(/\D/g, "")
      setAmount(newAmount)
    
    }
    function handleQuickSelect(value){
       setAmount(value)
    } 
    const isAmountValid = /^\d+$/.test(amount) && Number(amount) > 0
    function handleSubmit(){
      if (!/^07\d{8}$/.test(paymentPhone.replace(/\s/g, ""))) return
      setStatus("processing")
      console.log("Submitting amount:", amount, "to:", paymentPhone)
      // simulates mpesa payment untill backend m-pesa Api is connected
      setTimeout(()=>{
        setStatus("success")
      },3000)
    }
    function handleSubmitAnother() {
  setAmount("");
  setStatus("idle");
  
}
    function handleSignOut() {
      logout()
      navigate("/login", { replace: true })
    }
// displays the receipt after successfull remmitance 
if (status === "success") {
  return (
    <main className="success-shell">
      <section className="success-card" aria-labelledby="success-title">
        <div className="success-icon" aria-hidden="true">✓</div>
        <h1 className="success-title" id="success-title">Payment Received!</h1>
        <p className="success-copy">Successfully remitted</p>
        <p className="success-amount">KES {Number(amount).toLocaleString()}</p>
        <div className="receipt-details">
          <div className="receipt-row">
            <span>Reference</span>
            <strong>FP-2025-001847</strong>
          </div>
          <div className="receipt-row">
            <span>M-Pesa Code</span>
            <strong>QHF72JK48N</strong>
          </div>
          <div className="receipt-row">
            <span>Payment Number</span>
            <strong>{paymentPhone}</strong>
          </div>
          <div className="receipt-row">
            <span>Vehicle</span>
            <strong>KDG 567M</strong>
          </div>
        </div>
        <button
          className="submit-another-button"
          type="button"
          onClick={handleSubmitAnother}                                                                                                                                                                                                                                                                                                                                                              
        >
          Submit Another
        </button>
      </section>
    </main>
  );
}
    return(
      <div className="driver-page">
        <header className="driver-header">
          <div className="driver-header-inner">
            <div className="driver-brand-row">
              <div className="driver-brand">
                <span className="driver-brand-icon" aria-hidden="true">
                  <Truck size={17} strokeWidth={2.25} />
                </span>
                <span>FleetPesa</span>
              </div>
                  <button className="driver-signout" type="button" onClick={handleSignOut}>Sign out</button>
            </div>
            {/* Driver details are mock data until authentication/API intergration */}
            <div className="driver-profile">
              <p className="driver-label">Daily remittance for</p>
              <div className="driver-profile-row">
                <Avatar name = "Peter Omondi"/>
                <div>
                  <h1 className="driver-name">Peter Omondi</h1>
                  <p className="driver-vehicle">KDG 567M · Matatu</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="driver-content">
          <section className="amount-card">
            <label className="driver-label" htmlFor="amount">Amount to submit</label>
            <div className="amount-input-row">
              <span className="currency-prefix">KES</span>
              <input
                className="amount-input"
                id="amount"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                aria-describedby="amount-help"
              />
            </div>
            <div className="expected-row">
              <span>Expected today</span>
              <strong className="expected-amount">KES 4,500</strong>
            </div>
            <p className="amount-help" id="amount-help">Enter the amount you are remitting in Kenyan shillings.</p>
            <StatCard label="Expected today"
            value="KES 4500"/>
          </section>

          <section className="quick-section" aria-labelledby="quick-select-title">
            <h2 className="driver-label" id="quick-select-title">Quick select</h2>
            <div className="quick-grid">
              {quickAmounts.map((value) => (
                <button
                  className={`quick-button ${Number(amount) === value ? "quick-button-active" : ""}`}
                  key={value}
                  type="button"
                  aria-pressed={Number(amount) === value}
                  onClick={() => handleQuickSelect(value)}
                >
                  {value.toLocaleString()}
                </button>
              ))}
            </div>
          </section>
          <section className="payment-card" aria-label="Payment method">
            <div className="payment-details">
              <span className="payment-icon" aria-hidden="true">
                <Phone size={18} strokeWidth={2} />
              </span>
              <div>
                <h2 className="payment-name">M-Pesa</h2>
                <label className="payment-phone-label" htmlFor="payment-phone">Payment number</label>
                <input
                  className="payment-phone-input"
                  id="payment-phone"
                  type="tel"
                  inputMode="tel"
                  value={paymentPhone}
                  onChange={(event) => setPaymentPhone(event.target.value)}
                  aria-label="M-Pesa payment number"
                />
              </div>
            </div>
            <StatusBadge status="Ready"/>
          </section>

          <button
            className={`submit-button ${status === "processing" ? "submit-button-processing" : ""}`}
            type="button"
            onClick={handleSubmit}
            disabled={!isAmountValid || !/^07\d{8}$/.test(paymentPhone.replace(/\s/g, "")) || status === "processing"}
          >
            {status === "processing"
              ? "Processing..."
              :isAmountValid
              ?`Submit KES ${Number(amount).toLocaleString()}`
              : "Enter an amount"}
          </button>
        </main>
      </div>
    )
}
