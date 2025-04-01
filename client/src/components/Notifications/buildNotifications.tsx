import { Slide, toast } from 'react-toastify';
import ConfirmNotification from './ConfirmNotification.tsx';


export const buildLoginNotification = (confirmCallback: () => void) => {
  toast.info(ConfirmNotification, {
    data: {
      content: 'Please login to save your build',
      confirmContent: 'Login',
      cancelContent: 'Cancel',
      onConfirmClick: () => confirmCallback(),
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
};

export const buildCopyNotification = (confirmCallback: () => void) => {
  toast.info(ConfirmNotification, {
    data: {
      content: 'Would you like to make a copy of this build',
      confirmContent: 'Yes',
      cancelContent: 'No',
      onConfirmClick: () => confirmCallback(),
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
};