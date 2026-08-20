import { useState } from "react";
import { Phone, Truck } from "lucide-react";

export default function Driver(){
  // tracks remmitance amount and the current submission state
    const [amount,setAmount] = useState("")
    const [status,setStatus] = useState("idle")
    const quickAmounts = [1500,3000,4500]

    function handleAmountChange(event){
      const newAmount = event.target.value 
      setAmount(newAmount)
    
    }
    function handleQuickSelect(value){
       setAmount(value)
    } 
    const isAmountValid = Number(amount )> 0
    function handleSubmit(){
      setStatus("processing")
      console.log("Submitting amount:",amount)
      // simulates mpesa payment untill backend m-pesa Api is connected
      setTimeout(()=>{
        setStatus("success")
      },3000)
    }
    function handleSubmitAnother() {
  setAmount("");
  setStatus("idle");
  
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
              {/* <button className="driver-signout" type="button">Sign out</button> */}
            </div>
            {/* Driver details are mock data until authentication/API intergration */}
            <div className="driver-profile">
              <p className="driver-label">Daily remittance for</p>
              <div className="driver-profile-row">
                <span className="driver-avatar" aria-hidden="true">PO</span>
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
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
              />
            </div>
            <div className="expected-row">
              <span>Expected today</span>
              <strong className="expected-amount">KES 4,500</strong>
            </div>
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
          {/* currently static will later come from the users data */}
          <section className="payment-card" aria-label="Payment method">
            <div className="payment-details">
              <span className="payment-icon" aria-hidden="true">
                <Phone size={18} strokeWidth={2} />
              </span>
              <div>
                <h2 className="payment-name">M-Pesa</h2>
                <p className="payment-phone">+254 734 567 890</p>
              </div>
            </div>
            <span className="ready-badge">Ready</span>
          </section>

          <button
            className={`submit-button ${status === "processing" ? "submit-button-processing" : ""}`}
            type="button"
            onClick={handleSubmit}
            disabled={!isAmountValid || status === "processing"}
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
