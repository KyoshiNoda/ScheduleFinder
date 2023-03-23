import { Label, TextInput } from 'flowbite-react';

const FindUser = () => {
  return (
    <div>
      <div>
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
      </div>
    </div>
  );
};

export default FindUser;
