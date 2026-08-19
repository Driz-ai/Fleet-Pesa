import { useState } from "react";

export default function Driver(){
    const [amount,setAmount] = useState("")
    
    const quickAmounts = [1500,3000,4500]

    function handleAmountChange(event){
      const newAmount = event.target.value 
      setAmount(newAmount)
    
    }
    function handleQuickSelect(value){
       setAmount(value)
    } 

    return(
        <>
        <main>
      <h1>Daily Remittance</h1>

      <label htmlFor="amount">Amount To Submmit</label>
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
    </main>
        </>
    )
}