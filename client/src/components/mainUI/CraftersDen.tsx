import BuildPlane from './BuildPlane';
import BlockSelection from './BlockSelection';
import ButtonPanel from './ButtonPanel';
import { useAuth } from '../../hooks/useAuth';
import './CraftersDen.css';
import { useEffect, useState, useCallback, useRef } from 'react';
import React from 'react';
import {toByteArray} from 'base64-js';
import ErrorPopup from '../Notifications/ErrorPopup';
import SuccessPopup from '../Notifications/SuccessPopup';

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
 * @returns {Component} - A div element with the id 'main-ui' to render the den.
 */
export default function CraftersDen() {
  const [toSave, setToSave] = useState(false);
  const scene = useRef({});
  const progressPicture = useRef('');
  const {email} = useAuth() ?? {};
  const [isViewMode, setIsViewMode] = useState(false);
  const [error, setError] = useState({});

  // PLEASE CHANGE!!!!!!
  const curBuildId = null;

  const onSaveChanged = useCallback(
    (newState) => {
      setToSave(newState);
    }, [setToSave]);

  useEffect(() => {
    /**
     * Saves the current build in the db
     */
    async function savePost() {
      // fetch dataURL to get the blob
      try{
        console.log(progressPicture);
        const base64Data = progressPicture.current.split(',')[1];
        const byteArray = toByteArray(base64Data);
        const blob = new Blob([byteArray], { type: 'image/png' });
        const data = new FormData();
        console.log(scene);
        data.append('file', blob, 'blob.png');
        data.append('build', JSON.stringify(scene));
        data.append('buildId', curBuildId);
        data.append('email', email);
        const requestOptions = {
          method: 'POST',
          // TODO: change id to be not null if the build exists!!!
          body: data
          // use ID to find pre-existing build if it exists, if not leave it null.
        };
        const response = await fetch('/api/post/saves', requestOptions);
        const json = await response.json();

        if (!response.ok) {
          const err = new Error(`${json.message}`);
          error.status = json.status
          throw err;
        }

        setToSave(false);
      } catch (e) {
        setError({'message': e.message, 'status': error.status});
      }
    }
    if (toSave) {
      savePost();
    }

    // TODO: add cleanup function in case the toSave is spammed
  }, [toSave, email]);

    return (
      <>
        <div id="main-ui">
          {Object.keys(error).length && <ErrorPopup setError={setError} message={error.message} title={error.status}/>}
          <section className="build-tools">
            <BuildPlane 
            sceneState={scene}
            progressPicture={progressPicture} 
            setToSave={onSaveChanged} 
            isViewMode={isViewMode}/>
            {!isViewMode && <BlockSelection blockList={blockList}/>}
          </section>
          <ButtonPanel setIsViewMode={setIsViewMode} isViewMode={isViewMode}/>
        </div>
      </>
    );
}