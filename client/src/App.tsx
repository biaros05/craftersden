import React from 'react';
import './App.css';
import HelloWorld from './components/HelloWorld';
import BlockImage from './components/BlockImage';
import BlockScrollArea from './components/BlockScrollArea';
import BlockSelection from './components/BlockSelection';

const blockList = [
  { name: 'grass', src: 'https://www.filterforge.com/filters/11635.jpg', type: 'overworld' },
  { name: 'dirt', src: 'https://www.filterforge.com/filters/11636.jpg', type: 'overworld' },
  { name: 'stone', src: 'https://www.filterforge.com/filters/11637.jpg', type: 'overworld' },
  { name: 'sand', src: 'https://www.filterforge.com/filters/11638.jpg', type: 'overworld' },
  { name: 'water', src: 'https://www.filterforge.com/filters/11639.jpg', type: 'overworld' },
  { name: 'lava', src: 'https://www.filterforge.com/filters/11640.jpg' },
  { name: 'wood', src: 'https://www.filterforge.com/filters/11641.jpg' },
  { name: 'leaves', src: 'https://www.filterforge.com/filters/11642.jpg' },
  { name: 'glass', src: 'https://www.filterforge.com/filters/11643.jpg' },
  { name: 'brick', src: 'https://www.filterforge.com/filters/11644.jpg' }
];



function App() {
  
  return (
    <>
      <main>
        <section id="main-app">
          <HelloWorld></HelloWorld>
          <BlockSelection blockList={blockList} style={{width: "30%"}}/>
        </section>
      </main>
    </>
  );
}

export default App;
