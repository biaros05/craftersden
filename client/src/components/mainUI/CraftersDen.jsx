import BuildPlane from './BuildPlane';
import BlockSelection from './BlockSelection';
import ButtonPanel from './ButtonPanel';
import { useAuth } from '../../hooks/useAuth';
import './CraftersDen.css';
import { Component, useEffect, useState, useCallback, useRef } from 'react';
import {toByteArray} from 'base64-js';


/**
 * Crafters den main ui component with build plane and block selecction panel.
 * @returns {Component}A div element with the id 'main-ui' to render the den.
 */
export default function CraftersDen() {
  const [toSave, setToSave] = useState(false);
  const scene = useRef({});
  const progressPicture = useRef('');
  const {email} = useAuth() ?? {};

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
        data.append('file', blob, 'blob.png');
        data.append('build', scene);
        data.append('buildId', curBuildId);
        data.append('email', email);
        const requestOptions = {
          method: 'POST',
          // TODO: change id to be not null if the build exists!!!
          body: data
          // use ID to find pre-existing build if it exists, if not leave it null.
        };
        const response = await fetch('/api/post/save', requestOptions);
        const json = await response.json();
        console.log(json);
        setToSave(false);
      } catch (error) {
        console.log(error);
      }
    }
    if (toSave) {
      //console.log(JSON.stringify(scene));
      savePost();
    }

    // TODO: add cleanup function in case the toSave is spammed
  }, [toSave, email]);

  return (
    <div id="main-ui">
      <BuildPlane sceneState={scene} progressPicture={progressPicture} setToSave={onSaveChanged}/>
      <BlockSelection/>
      <ButtonPanel/>
    </div>
  );
}