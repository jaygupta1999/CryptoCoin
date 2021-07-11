import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import App from './components/App'
import Blocks from './components/Blocks'
import CreateTransaction from './components/CreateTransaction';
import TransactionPool from './components/TransactionPool'
import './index.css'


ReactDOM.render(
   <Router>
      <Switch>
         <Route exact path='/' component={App} />
         <Route path='/blocks' component={Blocks} />
         <Route path='/create-transaction' component={CreateTransaction} />
         <Route path='/transaction-pool' component={TransactionPool} />
      </Switch>
   </Router>, 
   document.getElementById('root')
);
