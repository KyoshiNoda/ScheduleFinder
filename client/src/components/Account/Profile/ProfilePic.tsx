import { useState, useRef } from 'react';
import { AiTwotoneEdit } from 'react-icons/ai';
import { useChangeProfilePictureMutation } from '../../../redux/services/user/userService';
import { Spinner } from 'flowbite-react';
import { useAppDispatch } from '../../../redux/store';
import { updateUserInfo } from '../../../redux/feats/auth/authSlice';
import { useAppSelector } from '../../../redux/store';
type Props = {
  picture: string | undefined;
};

const ProfilePic = (props: Props) => {
  const [imageURL, setImageURL] = useState<string | undefined>(props.picture);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [changeProfilePicture] = useChangeProfilePictureMutation();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.auth.userInfo);

  const handleProfilePicClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setIsLoading(true);
      try {
        const request = await changeProfilePicture({ file: selectedFile }).unwrap();
        const updatedUser = {
          ...userInfo,
          photoURL: request.imageUrl,
        };
        dispatch(updateUserInfo(updatedUser));
        setImageURL(request.imageUrl);
      } finally {
        setIsLoading(false);
      }
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

      {isLoading ? (
        <div className="flex h-24 w-24 items-center justify-center rounded-full border dark:border-gray-700 dark:bg-gray-500">
          <Spinner aria-label="Profile loading spinner" size="xl" />
        </div>
      ) : (
        <img alt="" className="h-24 w-24 rounded-full border dark:border-gray-700 dark:bg-gray-500" src={imageURL} />
      )}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
    </div>
  );
};

export default ProfilePic;
