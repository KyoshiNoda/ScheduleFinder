import { useState, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import { ToastEnum } from '../../../enums';
import { useAppSelector } from '../../../redux/store';
import { useToast } from '../../../utils/functions';
import {
  useAddUserHobbyMutation,
  useGetUserHobbiesQuery,
  useRemoveUserHobbyMutation,
} from '../../../redux/services/hobbies/hobbyService';
import Toast from '../../Utils/Toast';
import { Spinner, Button } from 'flowbite-react';
const HobbiesTab = () => {
  const hobbyToast = useAppSelector((state: any) => state.globalSlice.toast);
  const { showToast } = useToast();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [newHobby, setNewHobby] = useState<string>('');
  const [currentTag, setCurrentTag] = useState<string | undefined>(undefined);
  const [hobbies, setHobbies] = useState([]);

  const { data, isLoading } = useGetUserHobbiesQuery('Hobbies');
  const [addHobby] = useAddUserHobbyMutation();
  const [removeHobby] = useRemoveUserHobbyMutation();

  useEffect(() => {
    if (data && !isLoading) {
      setHobbies(data.hobbies);
    }
  }, [data, isLoading]);

  const hobbyClickedHandler = (tagName: string) => {
    setOpenModal(true);
    setCurrentTag(tagName);
  };
  const hobbyAddedHandler = async () => {
    try {
      await addHobby({ name: newHobby });
      setOpenModal(false);
      showToast(ToastEnum.ADDED_HOBBY);
    } catch (error: any) {
      console.log(error);
    }
  };
  const hobbyDeleteHandler = async () => {
    try {
      // await removeHobby({ name: newHobby });
      setOpenModal(false);
      showToast(ToastEnum.REMOVE_HOBBY);
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <>
      {hobbies ? (
        <>
          <div className="flex flex-col justify-center gap-4">
            <div className="rounded-xl  p-4">
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
                  placeholder="Soccer"
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
                {hobbies.map((hobby) => (
                  <Button
                    color="blue"
                    pill
                    className="w-20"
                    onClick={() => hobbyClickedHandler(hobby)}
                    key={hobby}
                  >
                    {hobby}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <Modal
            show={openModal}
            size="lg"
            onClose={() => setOpenModal(false)}
            popup
            position={'center'}
          >
            <Modal.Header />
            <Modal.Body>
              <div className="flex flex-col items-center justify-center gap-3">
                <p className="block text-base font-medium text-gray-900 dark:text-white">
                  Remove {currentTag} from your hobbies?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-blue-500 px-8 py-3 text-lg font-medium text-white dark:text-white "
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-red-500 px-8 py-3 text-lg font-medium text-white hover:bg-red-700 dark:bg-rose-600 dark:text-white hover:dark:bg-rose-800"
                    onClick={hobbyDeleteHandler}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : isLoading ? (
        <Spinner aria-label="Profile loading spinner" size="xl" />
      ) : (
        <div>User information not available.</div>
      )}

      {hobbyToast.state && <Toast message={hobbyToast.message} />}
    </>
  );
};

export default HobbiesTab;
