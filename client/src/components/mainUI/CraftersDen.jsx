import BuildPlane from './BuildPlane';
import BlockSelection from './BlockSelection';
import ButtonPanel from './ButtonPanel';
import { useAuth } from '../../hooks/useAuth';
import './CraftersDen.css';
import { Component, useEffect, useState, useCallback, useRef } from 'react';

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

/**
 * Crafters den main ui component with build plane and block selecction panel.
 * @returns {Component}A div element with the id 'main-ui' to render the den.
 */
export default function CraftersDen() {
  const [toSave, setToSave] = useState(false);
  const scene = useRef({});
  const {email} = useAuth() ?? {};

  // PLEASE CHANGE!!!!!!
  const curBuildId = '67b9ee078afa93a541131d01';

  const onSaveChanged = useCallback(
    (newState) => {
      setToSave(newState);
    }, [setToSave]);

  useEffect(() => {
    /**
     * Saves the current build in the db
     */
    async function savePost() {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // TODO: change id to be not null if the build exists!!!
        body: JSON.stringify({ email: email, build: scene, buildId: curBuildId})
        // use ID to find pre-existing build if it exists, if not leave it null.
      };
      const response = await fetch('/api/post/save', requestOptions);
      const json = await response.json();
      console.log(json);
      setToSave(false);
    }
    if (toSave) {
      //console.log(JSON.stringify(scene));
      savePost();
    }

    // TODO: add cleanup function in case the toSave is spammed
  }, [toSave, email]);

  return (
    <div id="main-ui">
      <BuildPlane sceneState={scene} setToSave={onSaveChanged}/>
      <BlockSelection blockList={blockList}/>
      <ButtonPanel/>
    </div>
  );
}