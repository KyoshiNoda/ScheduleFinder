import { Label, TextInput, Button, Modal } from 'flowbite-react';
import UserContainer from '../components/findUsers/UserContainer';
import Toggle from '../components/Toggle';
import { useState } from 'react';

const FindUser = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className="flex min-h-full flex-col items-center space-y-10 bg-slate-400 p-6 dark:bg-slate-900">
      <div className="self-end">
        <Toggle />
      </div>
      <div>
        <form action="">
          <Button onClick={() => setVisible(true)}>Toggle modal</Button>
          <Modal show={visible} size="md" popup={true} onClose={() => setVisible(false)}>
            <Modal.Header />
            <Modal.Body>
            
            </Modal.Body>
          </Modal>
          <div className="mb-2 block">
            <Label
              htmlFor="student-name"
              value="Search the name of the student you are looking for!"
            />
          </div>
          <TextInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            id="student-name"
            type="search"
            placeholder="Enter student's name"
            required={true}
          />
        </form>
      </div>
      <UserContainer inputValue={inputValue} />
    </div>
  );
};

export default FindUser;
