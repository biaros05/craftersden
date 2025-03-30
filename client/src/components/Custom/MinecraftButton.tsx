import React from "react";
import { UnstyledButton } from '@mantine/core';
import styles from './button.module.css';

type buttonType = "button" | "submit" | "reset" | undefined

/**
 * Creates a custom button component with custom styling
 * @param {JSON} children - Component's children
 * @returns {React.ReactNode} - custom button component
 */
export default function MinecraftButton({children, className = '', type, variant,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  onClick = (e) => {}}: {children: React.ReactNode, className: string, type?: buttonType, variant?: string, onClick: (arg0: React.MouseEvent<HTMLButtonElement>) => void}): React.ReactNode { 
  return (
    <UnstyledButton variant={variant} type={type} onClick={(e: React.MouseEvent<HTMLButtonElement>) => onClick(e)} className={`${styles.button} ${className}`} unstyled>{children}</UnstyledButton>
  );
}