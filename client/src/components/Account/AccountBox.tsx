import { useState } from 'react';
import Tab from './Tab';
import ProfileTab from './Profile/ProfileTab';
import PersonalTab from './Personal/PersonalTab';
import FriendsTab from './Friends/FriendsTab';

enum TabType {
  PROFILE = 'Profile',
  PERSONAL = 'Personal',
  FRIENDS = 'Friends',
}

const AccountBox = () => {
  const [currentTab, setCurrentTab] = useState<string | null>('Profile');

  const tabHandler = (tab: string | null) => {
    setCurrentTab(tab);
  };

  return (
    <div className="max-w-lg rounded-lg bg-gray-100 p-4 dark:bg-slate-800 sm:w-5/6 sm:p-8">
      <Tab getTab={tabHandler} activeTab={currentTab} />
      {currentTab === TabType.PROFILE && <ProfileTab />}
      {currentTab === TabType.PERSONAL && <PersonalTab />}
      {currentTab === TabType.FRIENDS && <FriendsTab />}
    </div>
  );
};

export default AccountBox;
