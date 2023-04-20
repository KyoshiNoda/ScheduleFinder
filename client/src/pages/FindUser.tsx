import { Label, TextInput } from 'flowbite-react';
import UserContainer from '../components/findUsers/UserContainer';
import Toggle from '../components/Toggle';
import { useState } from 'react';

const FindUser = () => {
  const [nameSearch, setNameSearch] = useState<string>('');
  const [schoolSearch, setSchoolSearch] = useState<string>('');
  const [majorSearch, setMajorSearch] = useState<string>('');

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
    </div>
  );
};

export default FindUser;
