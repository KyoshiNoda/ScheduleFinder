type Props = {
  getTab: (tab: string | null) => void;
  activeTab: string | null;
};

function Tab(props: Props): JSX.Element {
  return (
    <div className="mb-5 flex justify-center border-gray-200 text-center text-lg font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
      <ul className="flex flex-wrap sm:gap-5">
        <li>
          <div
            className={`inline-block cursor-pointer rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300 ${
              props.activeTab === 'Profile' && 'active-tab'
            }`}
            aria-current="page"
            onClick={() => props.getTab('Profile')}
          >
            Profile
          </div>
        </li>
        <li>
          <div
            className={`inline-block cursor-pointer rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300 ${
              props.activeTab === 'Personal' && 'active-tab'
            }`}
            onClick={() => props.getTab('Personal')}
          >
            Personal
          </div>
        </li>
        <li>
          <div
            className={`inline-block cursor-pointer rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300 ${
              props.activeTab === 'Friends' && 'active-tab'
            }`}
            onClick={() => props.getTab('Friends')}
          >
            Friends
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Tab;
