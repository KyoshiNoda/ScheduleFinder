import { Label, TextInput } from 'flowbite-react';
import UserContainer from '../components/UserContainer';
import { useState } from 'react';

const FindUser = () => {
  return (
    <div>
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
