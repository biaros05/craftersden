import React from 'react';
import '../../styles/ButtonPanel.css';
import useNavigate from '../Navigation/useNavigate.tsx';
import {buildLoginNotification, buildCopyNotification} from '../Notifications/buildNotifications';
import MinecraftButton from '../Custom/MinecraftButton.tsx';
import CloneableStructure from './deepslate/CloneableStructure.ts';

type ButtonPanelProps = { 
  setIsViewMode: (arg0: boolean) => void,
  canvas: React.RefObject<HTMLCanvasElement | null>,
  savePost: (arg0: string) => void,
  isViewMode: boolean,
  isUserLoggedIn: boolean,
  isBuildOwner: boolean,
  structure: CloneableStructure
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
 * @param {CloneableStructure} props.structure build blocks.
 * @returns {React.ReactNode} Button panel section with buttons
 */
function ButtonPanel({canvas, setIsViewMode, savePost, isViewMode, isUserLoggedIn, isBuildOwner, structure}: ButtonPanelProps): React.ReactNode {
  const navigate = useNavigate();
  return (
    <section className="button-panel">
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
            savePost(canvas.current!.toDataURL('image/png'));
          }
        }}
      >
        Save
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