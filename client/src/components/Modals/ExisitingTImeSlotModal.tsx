import { Modal, Button } from 'flowbite-react';
import { AiFillWarning } from 'react-icons/ai';
import { Dispatch, SetStateAction, RefObject } from 'react';
import { useEscapeKey } from '../../utils/functions';
type ExistingTimeSlotModalProps = {
  timeSlotError: boolean;
  setTimeSlotError: Dispatch<SetStateAction<boolean>>;
  setTimeSlotColor: Dispatch<SetStateAction<string>>;
  setColorError: Dispatch<SetStateAction<boolean>>;
  formRef: RefObject<HTMLFormElement>;
};

const ExistingTimeSlotModal = ({
  timeSlotError,
  setTimeSlotError,
  setTimeSlotColor,
  setColorError,
  formRef,
}: ExistingTimeSlotModalProps) => {
  useEscapeKey(() => setTimeSlotError(false));
  return (
    <Modal
      show={timeSlotError}
      size="md"
      popup={true}
      onClose={() => {
        setTimeSlotColor('border-none');
        setColorError(false);
        setTimeSlotError(false);
        formRef.current?.reset();
      }}
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <AiFillWarning className="mx-auto mb-4 h-14 w-14 text-red-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-red-500 dark:text-gray-400">
            There is an existing TimeSlot!
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color="gray"
              onClick={() => {
                setTimeSlotColor('border-none');
                setColorError(false);
                setTimeSlotError(false);
                formRef.current?.reset();
              }}
            >
              Ok Thank you!
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ExistingTimeSlotModal;
