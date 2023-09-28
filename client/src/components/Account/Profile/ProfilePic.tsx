import { useState, useRef } from 'react';
import { AiTwotoneEdit } from 'react-icons/ai';

type Props = {
  picture: string | undefined;
};

const ProfilePic = (props: Props) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProfilePicClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      // You can handle the selected file here, e.g., upload it to a server or update the UI.
      console.log('Selected file:', selectedFile);
    }
  };

  return (
    <div
      className="relative cursor-pointer"
      onClick={handleProfilePicClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-full">
          <AiTwotoneEdit className="rounded-full p-1 text-2xl text-white" size={40} />
        </div>
      )}
      <img
        alt=""
        className="h-24 w-24 rounded-full border dark:border-gray-700 dark:bg-gray-500"
        src={props.picture}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePic;
