import { useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import { ToastEnum } from '../../../enums';
import { useAppSelector } from '../../../redux/store';
import { useToast } from '../../../utils/functions';
import { useGetHobbiesQuery, useAddHobbyMutation, useEditHobbyMutation, useDeleteHobbyMutation } from '../../../redux/services/hobbies/hobbyService';
import Toast from '../../Utils/Toast';
const HobbiesTab = () => {
  const hobbyToast = useAppSelector((state: any) => state.globalSlice.toast);
  const { showToast } = useToast();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentTag, setCurrentTag] = useState<string | undefined>(undefined);
  const dummyTags: string[] = ['Soccer', 'Valorant', 'Gym', 'Cooking'];

  const hobbyClickedHandler = (tagName: string) => {
    setOpenModal(true);
    setCurrentTag(tagName);
  };
  const hobbyAddedHandler = async () => {
    try {
      //TODO: ADD RTK
      // useAddHobbyMutation()
      setOpenModal(false);
      showToast(ToastEnum.ADDED_HOBBY);
    } catch (error: any) {
      console.log(error);
    }
  };
  const hobbyEditedHandler = async () => {
    try {
      //TODO: ADD RTK
      // useEditHobbyMutation()
      setOpenModal(false);
      showToast(ToastEnum.EDITED_HOBBY);
    } catch (error: any) {
      console.log(error);
    }
  };
  const hobbyDeleteHandler = async () => {
    try {
      // TODO: ADD RTK
      // useDeleteHobbyMutation()
      setOpenModal(false);
      showToast(ToastEnum.REMOVE_HOBBY);
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center gap-4">
        <div className="rounded-xl  p-4">
          <p className="text-center text-2xl dark:text-white">New Hobby</p>
          <div className="mb-4">
            <label htmlFor="default-input" className="block text-lg font-medium text-gray-900 dark:text-white">
              Name
            </label>
            <input
              type="text"
              id="default-input"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Soccer"
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
            {dummyTags.map((hobby) => (
              <Button color="blue" pill className="w-20" onClick={() => hobbyClickedHandler(hobby)}>
                {hobby}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Modal show={openModal} size="lg" onClose={() => setOpenModal(false)} popup position={'center'}>
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center gap-3">
            <label htmlFor="default-input" className="block text-2xl font-medium text-gray-900 dark:text-white">
              Hobby
            </label>
            <input
              type="text"
              id="default-input"
              className="block w-1/2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder={currentTag}
            />
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="w-full rounded-full bg-green-400 px-8 py-3 text-lg font-semibold text-white hover:bg-green-600 dark:bg-green-700 dark:text-white hover:dark:bg-green-800"
                onClick={hobbyEditedHandler}
              >
                Save
              </button>
              <button
                type="submit"
                className="w-full rounded-full bg-red-500 px-8 py-3 text-lg font-semibold text-white hover:bg-red-700 dark:bg-rose-600 dark:text-white hover:dark:bg-rose-800"
                onClick={hobbyDeleteHandler}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {hobbyToast.state && <Toast message={hobbyToast.message} />}
    </>
  );
};

export default HobbiesTab;
