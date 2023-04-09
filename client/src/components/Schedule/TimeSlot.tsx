import React from 'react';

type Props = {
  id: string;
  top: string;
  height: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string | null;
  professor: string | null;
  color: string;
};

function TimeSlot(props: Props) {
  return (
    <div
      className={`absolute flex flex-col justify-center items-center gap-2 rounded bg-${props.color}-400 text-xs w-full dark:text-black`}
      style={{ top: `${props.top}px`, height: `${props.height}px` }}
    >
      <h2 className='text-center'>{props.title}</h2>
      <span>{`${props.startTime} - ${props.endTime}`}</span>
    </div>
  );
}

export default TimeSlot;
