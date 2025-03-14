import React from 'react';
import {Button} from '@mantine/core';
import '../../styles/ButtonPanel.css';
import useNavigate from '../Navigation/useNavigate.tsx';
import {buildLoginNotification, buildCopyNotification} from '../Notifications/buildNotifications'
import {jsonifyBlocks} from '../../utils/building_plane_utils.ts';
import { BlockType } from '../../utils/building_plane_utils.ts';

type ButtonPanelProps = { 
  setIsViewMode: (arg0: boolean) => void,
  canvas: React.RefObject<HTMLCanvasElement | null>,
  savePost: (arg0: string) => void,
  isViewMode: boolean,
  isUserLoggedIn: boolean,
  isBuildOwner: boolean,
  blocks: BlockType[]
}

/**
 * Displays Save and Toggle view mode buttons
 * @param {object} props React props
 * @param {React.RefObject} props.canvas React ref Cto canvas element
 * @param {Function} props.setIsViewMode Callback to set isViewModel state 
 * @param {Function} props.savePost thumbnail url
 * @param {boolean} props.isViewMode isViewMode state.
 * @param {string} props.isUserLoggedIn email of current user.
 * @param {boolean} props.isBuildOwner is current user the owner of the build.
 * @param {[]} props.blocks build blocks.
 * @returns {React.ReactNode} Button panel section with buttons
 */
function ButtonPanel({canvas, setIsViewMode, savePost, isViewMode, isUserLoggedIn, isBuildOwner, blocks}: ButtonPanelProps): React.ReactNode {
  const navigate = useNavigate();
  return (
    <section className="button-panel">
      <Button 
        variant="outline" 
        color="green" radius="md" 
        className="save-button"
        onClick={() => {
          if (!isUserLoggedIn) {
            const serializedBlocks = jsonifyBlocks(blocks);
            console.log(serializedBlocks);
            localStorage.setItem("build", JSON.stringify({"blocks": serializedBlocks}));
            buildLoginNotification(() => navigate('/login'));
          } else if (!isBuildOwner) {
            buildCopyNotification(() => savePost(canvas.current!.toDataURL('image/png')));
          }
          else {
            savePost(canvas.current!.toDataURL('image/png'));
          }
        }}
      >
        Save
      </Button>
      <Button 
        onClick={() => setIsViewMode(!isViewMode)}
        variant="outline" 
        color="green" radius="md" 
        className="save-button"
      >
        Toggle Mode
      </Button>
    </section>
  );
}

export default ButtonPanel;