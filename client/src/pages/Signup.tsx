import React from 'react';
import Toggle from '../components/Toggle';
import SignUpBox from '../components/Signup/SignUpBox';
import pic1 from '../assets/loggingOn.png';
import pic2 from '../assets/wavy-man-creating-a-website.png'
type Props = {};

function Signup({}: Props) {
  return (
    <div className="flex flex-col h-screen w-screen gap-40 bg-slate-400 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className='flex justify-evenly'>
        <div className='flex items-center'>
          <img src = {pic1} className='h-3/4'/>
        </div>
        <SignUpBox />
        <div className='flex items-center'>
          <img src = {pic2} className='h-2/3'/>
        </div>
      </div>
    </div>
  );
}

export default Signup;
