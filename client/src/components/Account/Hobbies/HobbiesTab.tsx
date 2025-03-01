import { useState, useEffect } from 'react';
import { ToastEnum } from '../../../enums';
import { useAppSelector } from '../../../redux/store';
import {
  useAddUserHobbyMutation,
  useGetUserHobbiesQuery,
} from '../../../redux/services/hobbies/hobbyService';
import Toast from '../../Globals/Toast';
import { Spinner, Button } from 'flowbite-react';
import { useToast } from '../../../utils/functions';
import HobbiesRemovalModal from '../../Modals/HobbiesRemovalModal';

const HobbiesTab = () => {
  const hobbyToast = useAppSelector((state: any) => state.globalSlice.toast);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [newHobby, setNewHobby] = useState<string>('');
  const [selectedHobby, setSelectedHobby] = useState<string>('');
  const [hobbies, setHobbies] = useState([]);

  const { data, isLoading } = useGetUserHobbiesQuery('Hobbies');
  const { showToast } = useToast();
  const [addHobby] = useAddUserHobbyMutation();

  useEffect(() => {
    if (data && !isLoading) {
      setHobbies(data.hobbies);
    }
  }, [data, isLoading]);

  const hobbyClickedHandler = (tagName: string) => {
    setOpenModal(true);
    setSelectedHobby(tagName);
  };

  const hobbyAddedHandler = async () => {
    try {
      await addHobby({ name: newHobby });
      setNewHobby('');
      showToast(ToastEnum.ADDED_HOBBY);
      const inputElement = document.getElementById('default-input') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      {hobbies ? (
        <>
          <div className="flex flex-col justify-center gap-4">
            <div className="rounded-xl p-4">
              <p className="text-center text-2xl dark:text-white">New Hobby</p>
              <div className="mb-4">
                <label
                  htmlFor="default-input"
                  className="block text-lg font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="default-input"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Enter hobby name"
                  value={newHobby}
                  onChange={(event) => setNewHobby(event.target.value)}
                />
              </div>
              <button
                type="button"
                className="w-full rounded bg-green-400 px-8 py-3 text-lg font-semibold text-white hover:bg-green-600 dark:bg-green-700 hover:dark:bg-green-800"
                onClick={hobbyAddedHandler}
              >
                Add
              </button>
            </div>

            <div className="rounded-xl bg-blue-400 dark:bg-white">
              <div className="flex h-32 flex-wrap justify-center gap-2 rounded-xl p-4">
                {hobbies.length === 0 ? (
                  <p>No Hobbies Found!</p>
                ) : (
                  hobbies.map((hobby) => (
                    <Button
                      color="blue"
                      pill
                      className="w-20"
                      onClick={() => hobbyClickedHandler(hobby)}
                      key={hobby}
                    >
                      {hobby}
                    </Button>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      ) : isLoading ? (
        <Spinner aria-label="Profile loading spinner" size="xl" />
      ) : (
        <div>User information not available.</div>
      )}

      <HobbiesRemovalModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedHobby={selectedHobby}
      />

      {hobbyToast.state && <Toast message={hobbyToast.message} />}
    </>
  );
};

export default HobbiesTab;
