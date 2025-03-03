import { MantineProvider, createTheme } from '@mantine/core';
import { ToastContentProps, toast } from 'react-toastify';
import {theme} from '../../main.tsx';
import React, {useState} from 'react';
import cx from 'clsx';
import {Button} from '@mantine/core';
import { Navigate } from "react-router-dom";

type CustomNotificationProps = ToastContentProps<{
  redirect: (arg0: string) => void,
  title: string;
  content: string;
}>;

export default function CustomNotification({
  closeToast,
  data,
  toastProps,
}: CustomNotificationProps) {
  const isColored = toastProps.theme === 'colored';

  return (
      <div className="flex flex-col w-full">
        <h3
          className={cx(
            'text-sm font-semibold',
            isColored ? 'text-white' : 'text-zinc-800'
          )}
        >
          {data.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm">{data.content}</p>
          <Button 
          className={cx(
            'ml-auto transition-all text-xs  border rounded-md px-4 py-2 text-white active:scale-[.95]',
            isColored ? 'bg-transparent' : 'bg-zinc-900'
          )}
          onClick={closeToast} 
          variant='filled'>
              Cancel
          </Button>
          {/* <Link to='/login'> */}
            <Button variant='filled'
            onClick={() => {
              data.redirect('/login');
            }}
            className={cx(
              'ml-auto transition-all text-xs  border rounded-md px-4 py-2 text-white active:scale-[.95]',
              isColored ? 'bg-transparent' : 'bg-zinc-900'
            )}>
              Login
            </Button>
          {/* </Link> */}
        </div>
      </div>
  );
}
