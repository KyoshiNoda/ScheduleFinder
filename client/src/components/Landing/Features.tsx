import compareSchedule from '../../assets/compareSchedule.png';
const Features = () => {
  return (
    <div className="h-screen gap-4">
      <div className="flex h-1/3 gap-4">
        <img
          src={compareSchedule}
          className="w-1/2 rounded-xl object-cover"
          alt="Schedule Comparison"
        />
        <div className="flex w-1/2 flex-col justify-center">
          <span className="block text-center text-3xl font-bold dark:text-white">
            Create meaningful connections
          </span>
          <span className="text-center text-xl text-gray-500 dark:text-gray-400">
            Discover new potential friends based on shared interests and availability. Filter
            through various categories such as age, major, school, gender, and more to find
            like-minded peers to study with.
          </span>
        </div>
      </div>

      <div className="flex h-1/3 gap-4">
        <div className="flex w-1/2 flex-col justify-center">
          <span className="block text-center text-3xl font-bold dark:text-white">
            Sync Google Calander
          </span>
          <span className="text-center text-xl text-gray-500 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          </span>
        </div>
        <img
          src={compareSchedule}
          className="w-1/2 rounded-xl object-cover"
          alt="Schedule Comparison"
        />
      </div>

      <div className="flex h-1/3 gap-4">
        <img
          src={compareSchedule}
          className="w-1/2 rounded-xl object-cover"
          alt="Schedule Comparison"
        />
        <div className="flex w-1/2 flex-col justify-center">
          <span className="block text-center text-3xl font-bold dark:text-white">
            User spotlight with AI
          </span>
          <span className="text-center text-xl text-gray-500 dark:text-gray-400">
          AI powered, user reccomendation based off hobbies, user interests blah blah blah dolore magna aliqua. Ut enim ad minim veniam,
          </span>
        </div>
      </div>
    </div>
  );
};
export default Features;
