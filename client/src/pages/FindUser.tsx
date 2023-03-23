import { Label, TextInput } from 'flowbite-react';
import UserContainer from '../components/UserContainer';
import Toggle from '../components/Toggle';
import { useState } from 'react';

const FindUser = () => {
  return (
    <div className="flex min-h-full flex-col items-center space-y-10 bg-slate-400 p-6 dark:bg-slate-900">
      <div className="self-end">
        <Toggle />
      </div>
      <div>
        <form action="">
          <div className="mb-2 block">
            <Label
              htmlFor="student-name"
              value="Search the name of the student you are looking for!"
            />
          </div>
          <TextInput
            id="student-name"
            type="text"
            placeholder="Enter student name"
            required={true}
          />
        </form>
      </div>
      <UserContainer />
    </div>
  );
};

export default FindUser;
