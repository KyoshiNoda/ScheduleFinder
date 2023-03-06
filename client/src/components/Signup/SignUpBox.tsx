import React from 'react';
import SignUpForm from './SignUpForm';
type Props = {};

function SignUpBox({}: Props) {
  return (
    <div className='flex flex-col gap-14 border rounded-lg p-10 border-black dark:border-white'>
      <div className='flex justify-center text-5xl dark:text-white'>
        Sign up
      </div>
      <SignUpForm/> 
    </div>
  );
}

export default SignUpBox;
