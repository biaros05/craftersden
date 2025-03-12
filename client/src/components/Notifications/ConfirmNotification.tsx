import { ToastContentProps } from 'react-toastify';
import React from 'react';
import cx from 'clsx';
import {Button} from '@mantine/core';
import '../../styles/CustomNotification.css';


type CustomNotificationProps = ToastContentProps<{
  content: string,
  confirmContent: string,
  cancelContent: string,
  onCancelClick?: () => void,
  onConfirmClick?: () => void,
}>;

/**
 * @param {object} props React props
 * @param {() => void} props.closeToast - callback to close the toast popup
 * @param {JSON} props.data - JSON containing all the data for the CustomNotification 
 * @param {JSON} props.toastProps - props to pass to the toast notification
 * @returns {React.ReactNode} - CustomNotification component
 */
export default function ConfirmNotification({
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
            onClick={() => {
              closeToast();
              if (data.onCancelClick) {
                data.onCancelClick();
              }
            }}
            variant='transparent' color="rgba(186, 181, 181, 1)">
              {data.cancelContent}
            </Button>
            <Button variant='transparent'
            color="rgba(186, 181, 181, 1)"
            onClick={() => {
              closeToast()
              if (data.onConfirmClick) {
                data.onConfirmClick();
              }
            }}
            className={cx(
              'ml-auto transition-all text-xs  border rounded-md px-4 py-2 text-white active:scale-[.95]',
              isColored ? 'bg-transparent' : 'bg-zinc-900'
            )}>
              {data.confirmContent}
            </Button>
          </div>
        </div>
      </div>
  );
}
