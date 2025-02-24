import React, {useState} from 'react';
import {Button} from '@mantine/core';
export default function ButtonPanel() {

  return (
    <Button 
      variant="outline" 
      color="green" radius="md" 
      className="save-button"
    >
      Save
    </Button>
  );
}