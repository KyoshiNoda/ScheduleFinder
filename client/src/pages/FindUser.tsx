import { Label, TextInput, Toast } from 'flowbite-react';
import { HiCheck } from 'react-icons/hi';
import UserContainer from '../components/findUsers/UserContainer';
import Toggle from '../components/Toggle';
import { useState } from 'react';
import { useAppSelector } from '../redux/store';
import { useAppDispatch } from '../redux/store';
import { addFriendRequestToast } from '../redux/feats/globalSlice/globalSlice';
const FindUser = () => {
  const [nameSearch, setNameSearch] = useState<string>('');
  const [schoolSearch, setSchoolSearch] = useState<string>('');
  const [majorSearch, setMajorSearch] = useState<string>('');

  const dispatch = useAppDispatch();
  const isDismissed: boolean = useAppSelector(
    (state: any) => state.globalSlice.addFriendRequestToast
  );
  const addFriendHandler = () => {
    dispatch(addFriendRequestToast(false));
  };
  return (
    <div className="flex min-h-full flex-col items-center space-y-10 bg-slate-400 p-6 dark:bg-slate-900">
      <div className="self-end">
        <Toggle />
      </div>
      <div>
        <form className="flex flex-col gap-8 lg:flex-row">
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="student-school"
                value="Search the school of the student you are looking for!"
              />
            </div>
            <TextInput
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
              id="student-school"
              type="search"
              placeholder="Enter student's school"
              required={true}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="student-name"
                value="Search the name of the student you are looking for!"
              />
            </div>
            <TextInput
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              id="student-name"
              type="search"
              placeholder="Enter student's name"
              required={true}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="student-major"
                value="Search the major of the student you are looking for!"
              />
            </div>
            <TextInput
              value={majorSearch}
              onChange={(e) => setMajorSearch(e.target.value)}
              id="student-major"
              type="search"
              placeholder="Enter student's major"
              required={true}
            />
          </div>
        </form>
      </div>
      <UserContainer
        schoolSearch={schoolSearch}
        nameSearch={nameSearch}
        majorSearch={majorSearch}
      />
      {isDismissed && (
        <div className="fixed bottom-4 left-4 z-50">
          <Toast className="border shadow-lg">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500 text-white shadow-md dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-semibold text-gray-800 dark:text-gray-300">
              Friend Request Sent!
            </div>
            <Toast.Toggle onClick={addFriendHandler} />
          </Toast>
        </div>
      )}
    </div>
  );
};

export default FindUser;
