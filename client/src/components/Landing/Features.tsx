import findUsers from '../../assets/findUsers.png';
import hourlyView from '../../assets/24HourView.png';
import AIHobbies from '../../assets/AIHobbies.png';

const Features = () => {
  return (
    <div className="h-screen lg:px-12 mb-12 md:mb-36">
      <div className="mb-4 flex items-center justify-center lg:mb-12">
        <h1 className="text-4xl font-bold dark:text-white lg:text-6xl">Features</h1>
      </div>
      <div className="flex h-1/3 gap-4">
        <img
          src={findUsers}
          className="w-2/5 rounded-xl border-4 border-gray-500 object-cover shadow-xl"
          alt="Schedule Comparison"
        />
        <div className="flex w-3/5 flex-col justify-center">
          <span className="block text-center text-lg font-bold dark:text-white lg:text-3xl">
            Create meaningful connections
          </span>
          <span className="text-center text-sm text-gray-500 dark:text-gray-400 lg:text-xl">
            Discover new potential friends based on shared interests and availability. Filter
            through various categories such as age, major, school, gender, and more to find
            like-minded peers to study with.
          </span>
        </div>
      </div>

      <div className="flex h-1/3 gap-4">
        <div className="flex w-3/5 flex-col justify-center">
          <span className="block text-center text-lg font-bold dark:text-white lg:text-3xl">
            Sync Google Calendar
          </span>
          <span className="text-center text-sm text-gray-500 dark:text-gray-400 md:text-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          </span>
        </div>
        <img
          src={hourlyView}
          className="w-2/5 rounded-xl border-4 border-gray-500 object-cover shadow-xl"
          alt="Google Calendar"
        />
      </div>

      <div className="flex h-1/3 gap-4">
        <img
          src={AIHobbies}
          className="w-2/5 rounded-xl border-4 border-gray-500 object-cover shadow-xl"
          alt="Hobbies AI"
        />
        <div className="flex w-3/5 flex-col justify-center">
          <span className="block text-center text-lg font-bold dark:text-white md:text-3xl">
            User spotlight with AI
          </span>
          <span className="text-center text-sm text-gray-500 dark:text-gray-400 md:text-xl">
            AI powered, user recommendation based off hobbies, user interests, blah blah blah dolore
            magna aliqua. Ut enim ad minim veniam,
          </span>
        </div>
      </div>
    </div>
  );
};

export default Features;
