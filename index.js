const express = require('express');
const request = require('request');
const path = require('path');
const cors = require('cors');

const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({blockchain,transactionPool,wallet,pubsub});


const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;


//Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));


//Request
app.get('/api/blocks', (req,res) => {
   res.json(blockchain.chain);
});

app.get('/api/blocks/length', (req,res) => {
   res.json(blockchain.chain.length);
});


app.get('/api/blocks/:id',(req,res)=>{
   const {id} = req.params;
   const {length} = blockchain.chain;

   const blockReversed = blockchain.chain.slice().reverse();
   let startIndex = (id-1) * 5;
   let endIndex = id * 5;

   startIndex = startIndex<length?startIndex:length;
   endIndex = endIndex<length?endIndex:length;

   res.json(blockReversed.slice(startIndex, endIndex));
});

app.post('/api/mine', (req,res) => {
   const {data} = req.body;

   blockchain.addBlock({data});

   pubsub.broadcastChain();

   res.redirect('/api/blocks');
})


app.post('/api/transact', (req,res)=> {
   const {amount, recipient} = req.body;
   let transaction = transactionPool.existingTransaction({ inputAddress:wallet.publicKey });

   try{
      if(transaction) {
         transaction.update({ senderWallet:wallet,recipient,amount});
      } else {
         transaction = wallet.createTransaction({
            recipient, 
            amount, 
            chain:blockchain.chain
         });
      }
   } catch(error) {
      return res.status(400).json({type:'error', message:error.message});
   }
   

   transactionPool.setTransaction(transaction);

   pubsub.broadcastTransaction(transaction);

   res.json({type:'success',transaction});
})

app.get('/api/transaction-pool-map',(req,res)=> {
   res.json(transactionPool.transactionMap);
})

app.get('/api/mine-transactions', (req,res)=> {
   transactionMiner.mineTransactions();

   res.redirect('/api/blocks');
})

app.get('/api/wallet-info',(req,res)=> {
   const address = wallet.publicKey;
   res.json({
      address,
      balance: Wallet.calculateBalance({ chain:blockchain.chain,address })
   })
})

app.get('*', (req,res) => {
   res.sendFile(path.join(__dirname, './client/dist/index.html'));
})

const syncWithRootState = () => {
   request({ url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error,response,body)=> {
      if (!error && response.statusCode === 200) {
         const rootChain = JSON.parse(body);
         
         console.log('replace chain on a sync with', rootChain);
         blockchain.replaceChain(rootChain);
      }
   });

   request({url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`}, (error,response,body)=> {
      if(!error && response.statusCode===200) {
         const rootTransactionPoolMap = JSON.parse(body);
         console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
         transactionPool.setMap(rootTransactionPoolMap);
      }
   })
};

const walletFoo = new Wallet();
const walletBar = new Wallet();

const generateWalletTransaction = ({wallet, recipient, amount}) => {
   const transaction = wallet.createTransaction({
      recipient, amount, chain:blockchain.chain
   });

   transactionPool.setTransaction(transaction);
}

const walletAction = ()=> generateWalletTransaction({
   wallet, recipient:walletFoo.publicKey,amount:5
});

const walletFooAction = ()=> generateWalletTransaction({
   wallet:walletFoo,recipient:walletBar.publicKey, amount:10
});

const walletBarAction = ()=> generateWalletTransaction({
   wallet:walletBar,recipient:wallet.publicKey, amount:15
});

for(let i=0;i<20;i++) {
   if(i%3 ===0 ){
      walletAction();
      walletFooAction();
   } else if(i%3==0){
      walletAction();
      walletBarAction();
   }
   else {
      walletFooAction();
      walletBarAction();
   }
   transactionMiner.mineTransactions();
}


let PEER_PORT;

if (process.env.GENERATE_PEER_PORT==='true'){
   PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, ()=> {
   console.log(`Server listening at port ${PORT}`);

   if (PORT!==DEFAULT_PORT) {
      syncWithRootState();
   }
})