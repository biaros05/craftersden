import React from "react";
import { UnstyledButton } from '@mantine/core';
import styles from './button.module.css';

/**
 * Creates a custom button component with custom styling
 * @param {JSON} children - Component's children
 * @returns {React.ReactNode} - custom button component
 */
export default function MinecraftButton({children}): React.ReactNode { 
  return (
    <UnstyledButton className={styles.button} unstyled>{children}</UnstyledButton>
  );
}