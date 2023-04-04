import React from 'react';

type Props = {
  top: string;
  height: string;
  time : string;
};

function TimeSlot(props: Props) {
  return (
    <div className={`absolute top-[${props.top}] h-[${props.height}] w-3/4 rounded bg-white`}>
     {props.time}
    </div>
  );
}

export default TimeSlot;
