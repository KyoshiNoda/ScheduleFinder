import { useAppDispatch } from '../redux/store';
import { toast } from '../redux/feats/globalSlice/globalSlice';
import { Themes } from '../enums';
import { useEffect } from 'react';
export const isDarkModeOn = () => {
  const theme = localStorage.getItem('theme');
  if (theme === Themes.DARK) {
    return true;
  }
  if (theme === Themes.LIGHT) {
    return false;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
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

export const calculateAge = (birthDate: Date): number => {
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
  ) {
    return age - 1;
  }

  return age;
};

export const useEscapeKey = (onClose: () => void) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);
};

export const capitalizeWord = (word: string) =>
  word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
