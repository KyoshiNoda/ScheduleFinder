type Props = {
  picture: string | undefined;
};

const ProfilePic = (props: Props) => {
  return (
    <img
      alt=""
      className="h-24 w-24 rounded-full border dark:border-gray-700 dark:bg-gray-500"
      src={props.picture}
    />
  );
};

export default ProfilePic;
