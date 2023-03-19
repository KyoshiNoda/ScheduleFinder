import Toggle from '../components/Toggle';
import AccountBox from '../components/Account/AccountBox';
type Props = {};

function Account({}: Props) {
  return (
    <div className="flex flex-col h-screen w-screen gap-20 p-3 bg-slate-400 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex h-screen p-10 justify-center">
        <AccountBox/>
      </div>
    </div>
  );
}

export default Account;
