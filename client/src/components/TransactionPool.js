import React, {useState,useEffect} from 'react';
import Transaction from './Transaction';
import {Link,useHistory} from 'react-router-dom';

const POLL_INTERVAL_MS = 10000;

function TransactionPool() {
   const [transactionPoolMap,setTransactionPoolMap] = useState({});
   const history=useHistory();
   const fetchTransactionPoolMap = ()=> {
      fetch('http://localhost:3000/api/transaction-pool-map')
         .then(response=>response.json())
         .then(data=>setTransactionPoolMap(data));
   }

   const fetchMineTransactions = ()=> {
      fetch(`${document.location.origin}/api/mine-transactions`)
         .then(response=> {
            if(response.status===200){
               alert('success');
               history.push('/blocks');
            } else {
               alert('The mine transactions block request did not complete.')
            }
         });
   }

   useEffect(()=>{
      fetchTransactionPoolMap();
      const fetchPoolMapInterval = setInterval(()=> fetchTransactionPoolMap(),POLL_INTERVAL_MS)

      return () => {
         clearInterval(fetchPoolMapInterval);
      }
   },[]);

   
   return (
      <div className='TransactionPool'>
         <button type="button" className="btn btn-outline-success">
            <Link to='/'><h2>Home</h2></Link>
         </button>
         <br />
         <br />
         <h3>Transaction Pool </h3>
         {
            Object.values(transactionPoolMap).map(transaction => {
               return (
                  <div key={transaction.id}>
                     <hr />
                     <Transaction transaction={transaction} />
                  </div>
               )
            })
         }
         <hr />
         <button type="button" 
            onClick = {fetchMineTransactions}
            className="btn btn-danger">
            Mine the Transactions
         </button>
         
      </div>
   )
}


export default TransactionPool
