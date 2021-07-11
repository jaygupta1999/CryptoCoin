const Transaction = require('../wallet/transaction');

class TransactionMiner {
   constructor({ blockchain, transactionPool, wallet, pubsub }){
      this.blockchain = blockchain;
      this.transactionPool = transactionPool;
      this.wallet = wallet;
      this.pubsub = pubsub;
   }

   mineTransactions() {
      //get the valid transaction pool from transaction pool
      const validTransactions = this.transactionPool.validTransactions();

      //generate the miner's reward
      validTransactions.push(Transaction.rewardTransaction({minerWallet:this.wallet}));

      //add a block consisting og these transactions to the block
      this.blockchain.addBlock({data:validTransactions});

      //broadcast the updated blockchain
      this.pubsub.broadcastChain();

      //clear the pool
      this.transactionPool.clear();

   }
}

module.exports = TransactionMiner;