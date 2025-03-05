import React from 'react';
import {Button} from '@mantine/core';
import useNavigate from '../Navigation/useNavigate.tsx';
import '../../styles/ButtonPanel.css';
import { toast } from 'react-toastify';
import CustomNotification from './CustomNotification.tsx'
import { Slide } from 'react-toastify';

type ButtonPanelProps = { 
  setIsViewMode: (arg0: boolean) => void,
  canvas: React.RefObject<null>,
  savePost: (arg0: string) => void,
  isViewMode: boolean,
  email: string
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
function ButtonPanel({canvas, setIsViewMode, savePost, isViewMode, email}: ButtonPanelProps): React.ReactNode {
  const navigate = useNavigate();
  return (
    <section className="button-panel">
      <Button 
        variant="outline" 
        color="green" radius="md" 
        className="save-button"
        onClick={() => {
          if (!email) {
            toast.info(CustomNotification, {
              data: {
                redirect: navigate,
                content: 'Please login to save your build',
              },
              ariaLabel: 'Something went wrong',
              position: "bottom-right",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Slide,
            });
          } else {
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