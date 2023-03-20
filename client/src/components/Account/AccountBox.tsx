import { useState } from 'react';
import Tab from './Tab';
import ProfileTab from './Profile/ProfileTab';
import PersonalTab from './Personal/PersonalTab';
import FriendsTab from './Friends/FriendsTab';

type Props = {};

function AccountBox({}: Props) {
  const [currentTab, setCurrentTab] = useState<string | null>('Profile');

  const tabHandler = (tab: string | null) => {
    setCurrentTab(tab);
  };

  return (
    <div className="bg-gray-100 max-w-lg dark:bg-slate-800 rounded-lg p-4 sm:w-5/6 sm:p-8">
      <Tab getTab={tabHandler} activeTab={currentTab} />
      {currentTab === 'Profile' && <ProfileTab />}
      {currentTab === 'Personal' && <PersonalTab />}
      {currentTab === 'Friends' && <FriendsTab />}
    </div>
  );
}

export default AccountBox;
