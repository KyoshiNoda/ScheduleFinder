import { useAppDispatch } from '../redux/store';
import { toast } from '../redux/feats/globalSlice/globalSlice';

export const isDarkModeOn = () => {
  const darkModeStatus = localStorage.getItem('isDarkModeOn');
  if (darkModeStatus) {
    return JSON.parse(darkModeStatus);
  }
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaQuery.matches;
};


export const useToast = () => {
  const dispatch = useAppDispatch();

  const showToast = async (message: string) => {
    dispatch(toast({ state: true, message }));

    setTimeout(() => {
      dispatch(toast({ state: false, message: null }));
    }, 5000);
  };

  return { showToast };
};
