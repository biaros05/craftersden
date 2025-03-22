import React from "react";
import { UnstyledButton } from '@mantine/core';
import styles from './button.module.css';

/**
 * Creates a custom button component with custom styling
 * @param {JSON} children - Component's children
 * @returns {React.ReactNode} - custom button component
 */
export default function MinecraftButton({children, className = '', 
  /* eslint-disable @typescript-eslint/no-unused-vars */
  onClick = (e) => {}}): React.ReactNode { 
  return (
    <UnstyledButton onClick={(e) => onClick(e)} className={`${styles.button} ${className}`} unstyled>{...children}</UnstyledButton>
  );
}