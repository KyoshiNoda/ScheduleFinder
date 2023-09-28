import { useState, useRef } from 'react';
import { AiTwotoneEdit } from 'react-icons/ai';
import { useChangeProfilePictureMutation } from '../../../redux/services/user/userService';

type Props = {
  picture: string | undefined;
};

const ProfilePic = (props: Props) => {
  const [imageURL, setImageURL] = useState<string | undefined>(props.picture);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [changeProfilePicture] = useChangeProfilePictureMutation();

  const handleProfilePicClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const request = await changeProfilePicture({ file: selectedFile }).unwrap();
      setImageURL(request.imageUrl);
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
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-75">
          <AiTwotoneEdit className="rounded-full p-1 text-2xl text-white" size={40} />
        </div>
      )}
      <img alt="" className="h-24 w-24 rounded-full border dark:border-gray-700 dark:bg-gray-500" src={imageURL} />
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
    </div>
  );
};

export default ProfilePic;
