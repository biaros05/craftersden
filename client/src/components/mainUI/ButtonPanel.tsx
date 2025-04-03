import React, { useState, useEffect } from 'react';
import '../../styles/ButtonPanel.css';
import useNavigate from '../Navigation/useNavigate.tsx';
import {buildLoginNotification, buildCopyNotification} from '../Notifications/buildNotifications';
import MinecraftButton from '../Custom/MinecraftButton.tsx';
import CloneableStructure from './deepslate/CloneableStructure.ts';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import BuildImport from './BuildImport.tsx';
import BuildExport from './BuildExport.tsx';

type ButtonPanelProps = { 
  setIsViewMode: (arg0: boolean) => void,
  canvas: React.RefObject<HTMLCanvasElement | null>,
  savePost: (arg0: string) => void,
  isViewMode: boolean,
  doCapture: boolean,
  isUserLoggedIn: boolean,
  isBuildOwner: boolean,
  structure: CloneableStructure,
  updateStructure: (arg0: CloneableStructure) => void,
  setDoCapture: (arg0: boolean) => void
}

/**
 * Displays Save and Toggle view mode buttons
 * @param {object} props React props
 * @param {React.RefObject} props.canvas React ref Cto canvas element
 * @param {Function} props.setIsViewMode Callback to set isViewModel state 
 * @param {Function} props.setDoCapture Callback to set doCapture state 
 * @param {Function} props.savePost thumbnail url
 * @param {boolean} props.isViewMode isViewMode state.
 * @param {boolean} props.doCapture isViewMode state.
 * @param {string} props.isUserLoggedIn email of current user.
 * @param {boolean} props.isBuildOwner is current user the owner of the build.
 * @param {CloneableStructure} props.structure build blocks.
 * @param {(CloneableStructure) => void} props.updateStructure callback to update user structure
 * @returns {React.ReactNode} Button panel section with buttons
 */
function ButtonPanel({canvas, setIsViewMode, savePost, isViewMode, isUserLoggedIn, isBuildOwner, structure, updateStructure, setDoCapture, doCapture}: ButtonPanelProps): React.ReactNode {
  const [importOpened, {open: openImport, close: closeImport}] = useDisclosure(false);
  const [exportOpened, {open: openExport, close: closeExport}] = useDisclosure(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [capturedImage, setCapturedImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (doCapture) {
      requestAnimationFrame(() => {
        const realCanvas = canvas.current;
        if (realCanvas) {
          const imageData = realCanvas.toDataURL('image/png');
          setCapturedImage(imageData);
        }
      });
    }
  }, [doCapture]);
  
  useEffect(() => {
    if (capturedImage && capturedImage !== '') {
      savePost(capturedImage);
    }
  }, [capturedImage]);
  
  return (
    <section className="button-panel">
      <Modal opened={importOpened} onClose={closeImport} title='Import Build'>
        <BuildImport updateStructure={updateStructure} close={closeImport} />
      </Modal>
      <Modal opened={exportOpened} onClose={closeExport} title='Export Build'>
        <BuildExport structure={structure} close={closeExport} />
      </Modal>
      <MinecraftButton 
        className="save-button"
        onClick={() => {
          if (!isUserLoggedIn) {
            const serializedBlocks = structure.toJson();
            localStorage.setItem("build", JSON.stringify({"structure": serializedBlocks}));
            buildLoginNotification(() => navigate('/login'));
          } else if (!isBuildOwner) {
            buildCopyNotification(() => savePost(canvas.current!.toDataURL('image/png')));
          }
          else {
            setDoCapture(true);
          }
        }}
      >
        Save
      </MinecraftButton>
      <MinecraftButton className='export-build' onClick={openImport}>
        Import
      </MinecraftButton>
      <MinecraftButton className='import-build' onClick={() => {
        openExport();
      }}>
        Export
      </MinecraftButton>
      <MinecraftButton 
        onClick={() => setIsViewMode(!isViewMode)}
        className="save-button"
      >
        Toggle Mode
      </MinecraftButton>
    </section>
  );
}

export default ButtonPanel;