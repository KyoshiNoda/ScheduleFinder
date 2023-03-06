import React from 'react';
import Toggle from '../components/Toggle';
import SignUpBox from '../components/Signup/SignUpBox';
type Props = {};

function Signup({}: Props) {
  return (
    <div className="flex flex-col h-screen w-screen gap-40 p-3 bg-slate-400 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className='w-1/3 h-1/3'>
        <SignUpBox/>
      </div>
    </div>
  );
}

export default Signup;
