import { useState } from "react";

export default function Driver(){
    const [amount,setAmount] = useState("")

    function handleAmountChange(event){
      const newAmount = event.target.value 
      setAmount(newAmount)

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
    </main>
        </>
    )
}