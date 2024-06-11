import AccountBox from '../components/Account/AccountBox';
import Toast from '../components/Globals/Toast';
import { useAppSelector } from '../redux/store';
const Account = () => {
  const accountToast = useAppSelector((state: any) => state.globalSlice.toast);
  return (
    <div className="flex min-h-full flex-col gap-20 bg-gray-50 p-3 dark:bg-slate-900">
      <div className="flex min-h-full justify-center">
        <AccountBox />
      </div>
      {accountToast.state && <Toast message={accountToast.message} />}
    </div>
  );
};

export default Account;
