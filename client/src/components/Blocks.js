import React, {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import Block from './Block';
import Particles from 'react-particles-js';

function Blocks() {
   const [blocks, setBlocks] = useState([]);
   const [paginatedId,setPaginatedId] = useState(1);
   const [blocksLength, setBlocksLength] = useState(0);

   useEffect(() => {
     fetch(`http://localhost:3000/api/blocks/length`)
      .then(response=>response.json())
      .then(data=>setBlocksLength(data));

      fetchPaginatedBlocks(paginatedId);
   },[])

   const fetchPaginatedBlocks = paginatedId => {
    fetch(`http://localhost:3000/api/blocks/${paginatedId}`)
      .then(data=>data.json())
      .then(data=>setBlocks(data))
   }

   return (
      <div>
         <button type="button" className="btn btn-outline-success" ><Link to='/'><h2>Home</h2></Link></button>
         <h2>Blocks</h2>
         <div>
           {
             [...Array(Math.ceil(blocksLength/5)).keys()].map( key => {
               const paginatedId = key+1;

               return (
                 <span key={key} onClick={()=>fetchPaginatedBlocks(paginatedId)}>
                   <button className="btn btn-danger">{paginatedId}</button>{' '}
                 </span>
               )
             })
           }
         </div>
         {
            blocks.map(block => {
               return (
                  <Block key={block.hash} block={block} />
               )
            })
         }
         <Particles params={particlesConfig} className="app-particles__container" />
      </div>
   )
}







const particlesConfig = {
   "particles": {
     "number": {
       "value": 140,
       "density": {
         "enable": true,
         "value_area": 3000
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
       "color": "#ffffff",
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
         "speed": 3
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

export default Blocks
