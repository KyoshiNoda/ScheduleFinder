import Toggle from '../components/Toggle';
import AccountBox from '../components/Account/AccountBox';
type Props = {};

function Account({}: Props) {
  return (
    <div className="flex flex-col gap-20 min-h-full p-3 bg-slate-400 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex justify-center min-h-full">
        <AccountBox />
      </div>
    </div>
  );
}

export default Account;
