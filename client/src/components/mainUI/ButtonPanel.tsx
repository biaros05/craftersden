import React from 'react';
import {Button} from '@mantine/core';
import Link from '../Navigation/Link.tsx';
import useNavigate from '../Navigation/useNavigate.tsx';
import '../../styles/ButtonPanel.css';
import { toast } from 'react-toastify';
import {theme} from '../../main.tsx';
import CustomNotification from './CustomNotification.tsx'

export default function ButtonPanel({canvas, setIsViewMode, savePost, isViewMode, email}) {
  const navigate = useNavigate();
  return (
    <section className="button-panel">
      <Button 
        variant="outline" 
        color="green" radius="md" 
        className="save-button"
        onClick={() => {
          if (!email) {
            toast(CustomNotification, {
              data: {
                redirect: navigate,
                title: 'Oh no!',
                content: 'Please login to save your build',
              },
              progress: 0.2,
              ariaLabel: 'Something went wrong',
              autoClose: false
            });
          } else {
            savePost(canvas.current.toDataURL('image/png'));
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