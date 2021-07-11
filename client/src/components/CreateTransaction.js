import React, {useState} from 'react';
import {Link,useHistory} from 'react-router-dom';

function CreateTransaction() {
   let history=useHistory();
   const [recipient,setRecipient] = useState('');
   const [amount,setAmount] = useState(0);
   const updateRecipient = e => {
      setRecipient(e.target.value);
   }

   const updateAmount = e => {
      setAmount(parseInt(e.target.value));
   }

   const createTransaction = ()=> {
      fetch('http://localhost:3000/api/transact', {
         method:'POST',
         headers: {'Content-Type':'application/json'},
         body: JSON.stringify({recipient,amount})
      }).then(response=>response.json())
         .then(json=>{
            alert(json.message || json.type)
            history.push('/transaction-pool');
         })
   }
   return (
      <div className="conductTransaction">
         <button type="button" className="btn btn-outline-success">
            <Link to='/'><h2>Home</h2></Link>
         </button>
         <h3>Create Transaction</h3>
         <div className="form-group">
            <label htmlFor="recipient">Enter Recipient Address</label>
            <input type="text"
               id="recipient"
               placeholder="recipient"
               value={recipient}
               onChange={updateRecipient}
               className="form-control"
            />
            <label htmlFor="amount">Enter Amount</label>
            <input type="number"
               id="amount"
               placeholder="Amount"
               value={amount}
               onChange={updateAmount}
               className="form-control"
            />
         </div>
         <button type="submit"
            className="btn btn-danger"
            onClick={createTransaction}>Submit</button>
      </div>
   )
}

export default CreateTransaction
