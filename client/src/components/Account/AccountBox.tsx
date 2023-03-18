import {useState} from 'react';
import Tab from './Tab';
import ProfileTab from './Profile/ProfileTab';
type Props = {};

function AccountBox({}: Props) {
  const [currentTab,setCurrentTab] = useState<string | null>(null);
  const tabHandler = (tab: string | null) => {
   setCurrentTab(tab);
  };

  return (
    <div className="bg-gray-100 dark:bg-slate-800 w-2/5 rounded-lg p-4">
      <Tab getTab={tabHandler} />
      <ProfileTab />
    </div>
  );
}

export default AccountBox;
