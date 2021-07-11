import React, {useState} from 'react'
import Transaction from './Transaction';

function Block({block}) {
   const [displayTransaction, setDisplayTransaction] = useState(false);

   const toggleTransaction = ()=> {
      setDisplayTransaction(value => !value);
   }

   const {timestamp, hash, data} = block;
   const hashDisplay = `${hash.substring(0,15)}...`;
   const stringifiedData = JSON.stringify(data);

   const dataDisplay = stringifiedData.length > 35?`${stringifiedData.substring(0,35)}...`:stringifiedData;

   return (
     <div className='Block'>
      {
         data.map(transaction => (
            <div key={transaction.id}>
               <hr />
               <Transaction transaction={transaction} />
            </div>
         ))
      }
      <br />

         
     </div>
   );
}

export default Block
