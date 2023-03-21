import Toggle from '../components/Toggle';
import AccountBox from '../components/Account/AccountBox';
type Props = {};

function Account({}: Props) {
  return (
    <div className="flex min-h-full flex-col gap-20 bg-slate-400 p-3 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex min-h-full justify-center">
        <AccountBox />
      </div>
    </div>
  );
}

export default Account;
