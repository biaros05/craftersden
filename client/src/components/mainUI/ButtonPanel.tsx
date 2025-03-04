import React from 'react';
import {Button} from '@mantine/core';
import '../../styles/ButtonPanel.css';
import { useNavigate } from 'react-router-dom';

type ButtonPanelProps = { 
  setIsViewMode: (arg0: boolean) => void,
  canvas: React.RefObject<null>,
  savePost: (arg0: string) => void,
  isViewMode: boolean 
}

/**
 * Displays Save and Toggle view mode buttons
 * @param {object} props React props
 * @param {React.RefObject} props.canvas React ref to canvas element
 * @param {Function} props.setIsViewMode Callback to set isViewModel state 
 * @param {Function} props.savePost thumbnail url
 * @param {boolean} props.isViewMode isViewMode state.
 * @returns {React.ReactNode} Button panel section with buttons
 */
function ButtonPanel({canvas, setIsViewMode, savePost, isViewMode}: ButtonPanelProps): React.ReactNode {

  const navigate = useNavigate();

  return (
    <section className="button-panel">
      <Button 
        variant="outline" 
        color="green" radius="md" 
        className="save-button"
        onClick={() => {
          savePost(canvas.current!.toDataURL('image/png'));
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