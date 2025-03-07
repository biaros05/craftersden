import { ToastContentProps } from 'react-toastify';
import React from 'react';
import cx from 'clsx';
import {Button} from '@mantine/core';
import '../../styles/CustomNotification.css';


type CustomNotificationProps = ToastContentProps<{
  redirect: (arg0: string) => void,
  content: string;
}>;

/**
 * @param {object} props React props
 * @param {() => void} props.closeToast - callback to close the toast popup
 * @param {JSON} props.data - JSON containing all the data for the CustomNotification 
 * @param {JSON} props.toastProps - props to pass to the toast notification
 * @returns {React.ReactNode} - CustomNotification component
 */
export default function CustomNotification({
  closeToast,
  data,
  toastProps,
}: CustomNotificationProps) {
  const isColored = toastProps.theme === 'colored';

  return (
      <div className="flex flex-col w-full container">
        <div className="flex items-center justify-between w-full">
          <p className="text-sm">{data.content}</p>
          <div className='button-panel'>
            <Button 
            className={cx(
              'ml-auto transition-all text-xs  border rounded-md px-4 py-2 text-white active:scale-[.95]',
              isColored ? 'bg-transparent' : 'bg-zinc-900'
            )}
            onClick={closeToast} 
            variant='transparent' color="rgba(186, 181, 181, 1)">
                Cancel
            </Button>
            <Button variant='transparent'
            color="rgba(186, 181, 181, 1)"
            onClick={() => {
              closeToast()
              data.redirect('/login');
            }}
            className={cx(
              'ml-auto transition-all text-xs  border rounded-md px-4 py-2 text-white active:scale-[.95]',
              isColored ? 'bg-transparent' : 'bg-zinc-900'
            )}>
              Login
            </Button>
          </div>
        </div>
      </div>
  );
}
