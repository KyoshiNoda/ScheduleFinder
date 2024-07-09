import findUsers from '../../assets/findUsers.png';
import hourlyView from '../../assets/24HourView.png';
import AIHobbies from '../../assets/AIHobbies.png';
const Features = () => {
  return (
    <div className="h-screen">
      <div className="flex justify-center items-center mb-12">
        <h1 className='text-6xl font-bold dark:text-white'>Features</h1>
      </div>
      <div className="flex h-1/3 gap-4">
        <img
          src={findUsers}
          className="w-1/2 rounded-xl object-cover shadow-xl border-4 border-gray-500"
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
          src={hourlyView}
          className="w-1/2 rounded-xl object-cover shadow-xl border-4 border-gray-500"
          alt="Schedule Comparison"
        />
      </div>

      <div className="flex h-1/3 gap-4">
        <img
          src={AIHobbies}
          className="w-1/2 rounded-xl object-cover shadow-xl border-4 border-gray-500"
          alt="Schedule Comparison"
        />
        <div className="flex w-1/2 flex-col justify-center">
          <span className="block text-center text-3xl font-bold dark:text-white">
            User spotlight with AI
          </span>
          <span className="text-center text-xl text-gray-500 dark:text-gray-400">
            AI powered, user reccomendation based off hobbies, user interests blah blah blah dolore
            magna aliqua. Ut enim ad minim veniam,
          </span>
        </div>
      </div>
    </div>
  );
};
export default Features;
