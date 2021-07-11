import React, {useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import Particles from 'react-particles-js';

function App() {
   const [walletInfo, setWalletInfo] = useState({});
   const {address,balance} = walletInfo;
   useEffect(()=> {
      fetch('http://localhost:3000/api/wallet-info')
         .then(response=>response.json())
         .then(data=>setWalletInfo(data));
   },[])

  
   return (
      <div className="App">
         <img className="logo" src={logo}/>
         <h1>Welcome to the JCOIN Blockchain Network</h1>
         <button type="button" className="btn btn-outline-success">
          <Link to='/blocks'><h3>Blocks</h3></Link>
         </button>
         <button type="button" className="btn btn-outline-success">
          <Link to='/create-transaction'><h3>Conduct a Transaction</h3></Link>
         </button>
         <button type="button" className="btn btn-outline-success">
          <Link to='/transaction-pool'><h3>Transaction Pool</h3></Link>
         </button>
         <br />
         <br />
         <div className="walletInfo">
          <h1>My Wallet Address: {address}</h1>
          <h1>Balance: {balance}</h1>
         </div>

         <Particles params={particlesConfig} className="App-particles__container" />
      </div>
   )
}

const particlesConfig = {
   "particles": {
     "number": {
       "value": 140,
       "density": {
         "enable": true,
         "value_area": 800
       }
     },
     "color": {
       "value": "#fff"
     },
     "shape": {
       "type": "circle",
       "stroke": {
         "width": 0,
         "color": "#000000"
       },
       "polygon": {
         "nb_sides": 5
       },
       "image": {
         "src": "img/github.svg",
         "width": 100,
         "height": 100
       }
     },
     "opacity": {
       "value": 0.3,
       "random": false,
       "anim": {
         "enable": false,
         "speed": 0.1,
         "opacity_min": 0.1,
         "sync": false
       }
     },
     "size": {
       "value": 3,
       "random": true,
       "anim": {
         "enable": false,
         "speed": 40,
         "size_min": 0.1,
         "sync": false
       }
     },
     "line_linked": {
       "enable": true,
       "distance": 150,
       "color": "#fff",
       "opacity": 0.4,
       "width": 1
     },
     "move": {
       "enable": true,
       "speed": 6,
       "direction": "none",
       "random": false,
       "straight": false,
       "out_mode": "out",
       "bounce": false,
       "attract": {
         "enable": false,
         "rotateX": 600,
         "rotateY": 1200
       }
     }
   },
   "interactivity": {
     "detect_on": "canvas",
     "events": {
       "onhover": {
         "enable": false,
         "mode": "repulse"
       },
       "onclick": {
         "enable": false,
         "mode": "push"
       },
       "resize": true
     },
     "modes": {
       "grab": {
         "distance": 400,
         "line_linked": {
           "opacity": 1
         }
       },
       "bubble": {
         "distance": 400,
         "size": 40,
         "duration": 2,
         "opacity": 8,
         "speed": 1
       },
       "repulse": {
         "distance": 200,
         "duration": 0.4
       },
       "push": {
         "particles_nb": 4
       },
       "remove": {
         "particles_nb": 2
       }
     }
   },
   "retina_detect": true
 }
 

export default App
