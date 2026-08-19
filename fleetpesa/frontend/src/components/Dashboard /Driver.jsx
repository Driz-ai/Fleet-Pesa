import { useState } from "react";

export default function Driver(){
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
      setTimeout(()=>{
        setStatus("success")
      },3000)
    }
    function handleSubmitAnother() {
  setAmount("");
  setStatus("idle");
  
}
if (status === "success") {
  return (
    <main>
      <h2>Payment Received!</h2>
      <p>Successfully remitted</p>
      <h1>KES {Number(amount).toLocaleString()}</h1>
      <div>
        <p>Reference: FP-2025-001847</p>
        <p>M-Pesa Code: QHF72JK48N</p>
        <p>Vehicle: KDG 567M</p>
      </div>
      <button
        type="button"
        onClick={handleSubmitAnother}
      >
        Submit Another
      </button>
    </main>
  );
}
    return(
        <>
        <main>
      <h1>Daily Remittance</h1>

      <label htmlFor="amount">Amount To Submit</label>
      <input
        id="amount"
        type="number"
        value={amount}
        onChange={handleAmountChange}
        placeholder="Enter amount"
      />
         <p>Current amount: {amount}</p>
         <div>
        <p>Quick Select</p>

        {quickAmounts.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleQuickSelect(value)}
          >
            {value}
          </button>
        ))}
      </div>
            <button
        type="button"
        onClick={handleSubmit}
        disabled={!isAmountValid || status === "processing"}
      >
        {status == "processing"
          ? "Processing..."
          :isAmountValid
          ?`Submit KES ${Number(amount).toLocaleString()}`
          : "Enter an amount"}
      </button>
    
    </main>
        </>
    )
}