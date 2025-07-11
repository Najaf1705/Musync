import toast from 'react-hot-toast';
import CustomToast from '../CustomToast'; // adjust path if needed

export const showSuccessToast = (message) => {
  toast.custom((t) => (
    <CustomToast t={t} message={message} type="success" />
  ));
};

export const showErrorToast = (message) => {
  toast.custom((t) => (
    <CustomToast t={t} message={message} type="error" />
  ));
};
export const showInfoToast = (message) => {
  toast.custom((t) => (
    <CustomToast t={t} message={message} type="info" />
  ));
};
