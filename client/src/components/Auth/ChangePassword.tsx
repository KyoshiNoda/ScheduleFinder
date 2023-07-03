import { useState, useRef, useEffect } from 'react';
import { Axios } from 'axios';
import { useAppDispatch, useAppSelector } from '../../redux/store';
function ChangePassword() {
  const newPassword = useRef(document.createElement('input'));
  const oldPassword = useRef(document.createElement('input'));
  const confirmPassword = useRef(document.createElement('input'));

  const [validPassword, setIsValidPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<boolean | undefined>(
    undefined
  );

  return (
    <div
      className={`flex w-5/6 flex-col justify-center rounded-lg border bg-white p-5 dark:bg-slate-700 lg:w-1/3 ${
        validPassword ? 'border-rose-500 dark:border-rose-500' : ''
      }`}
    ></div>
  );
}

export default ChangePassword;
