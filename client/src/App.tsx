import React from 'react';
import './App.css';
import HelloWorld from './components/HelloWorld';
import BlockImage from './components/BlockImage';
import BlockScrollArea from './components/BlockScrollArea';

const blockList = [
  { name: 'grass', src: 'https://www.filterforge.com/filters/11635.jpg' },
  { name: 'dirt', src: 'https://www.filterforge.com/filters/11636.jpg' },
  { name: 'stone', src: 'https://www.filterforge.com/filters/11637.jpg' },
  { name: 'sand', src: 'https://www.filterforge.com/filters/11638.jpg' },
  { name: 'water', src: 'https://www.filterforge.com/filters/11639.jpg' },
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
          <BlockScrollArea blockList={blockList}/>
        </section>
      </main>
    </>
  );
}

export default App;
