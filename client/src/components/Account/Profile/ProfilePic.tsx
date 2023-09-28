import { useState } from 'react';
import { AiTwotoneEdit } from 'react-icons/ai';
type Props = {
  picture: string | undefined;
};

const ProfilePic = (props: Props) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-full">
          <AiTwotoneEdit className="rounded-full  p-1 text-2xl text-white" size={40}/>
        </div>
      )}
      <img alt="" className="h-24 w-24 rounded-full border dark:border-gray-700 dark:bg-gray-500" src={props.picture} />
    </div>
  );
};

export default ProfilePic;
