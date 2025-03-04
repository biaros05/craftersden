import React, {useState} from 'react';
import {Button} from '@mantine/core';
import '../../styles/ButtonPanel.css';
import { useNavigate } from 'react-router-dom';

export default function ButtonPanel({canvas, setIsViewMode, savePost, isViewMode}) {
  const navigate = useNavigate();

  return (
    <section className="button-panel">
      <Button 
        variant="outline" 
        color="green" radius="md" 
        className="save-button"
        onClick={() => {
          savePost(canvas.current.toDataURL('image/png'));
          navigate('/profile');
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