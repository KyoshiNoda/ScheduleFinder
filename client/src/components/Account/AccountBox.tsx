import { useState } from 'react';
import Tab from './Tab';
import ProfileTab from './Profile/ProfileTab';
import PersonalTab from './Personal/PersonalTab';
import HobbiesTab from './Hobbies/HobbiesTab';
import { AccountTabEnum } from '../../enums';

const AccountBox = () => {
  const [currentTab, setCurrentTab] = useState<string | null>('Profile');

  const tabHandler = (tab: string | null) => {
    setCurrentTab(tab);
  };

  return (
    <div className="max-w-lg rounded-lg bg-white border shadow dark:border-none dark:shadow-none p-4 dark:bg-slate-800 sm:w-5/6 sm:p-8">
      <Tab getTab={tabHandler} activeTab={currentTab} />
      {currentTab === AccountTabEnum.PROFILE && <ProfileTab />}
      {currentTab === AccountTabEnum.PERSONAL && <PersonalTab />}
      {currentTab === AccountTabEnum.HOBBIES && <HobbiesTab />}
    </div>
  );
};

export default AccountBox;
