import { Dispatch, SetStateAction, RefObject } from 'react';
import { Modal, Button } from 'flowbite-react';
import { Label } from 'flowbite-react';
import { useEscapeKey } from '../../utils/functions';

type ChangePasswordModalProps = {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
  currentPasswordRef: RefObject<HTMLInputElement>;
  newPasswordRef: RefObject<HTMLInputElement>;
  newConfirmedPasswordRef: RefObject<HTMLInputElement>;
  isCurrentPasswordError: boolean;
  isNewPasswordError: boolean;
  errorMessage: string;
  passwordHandler: () => void;
};

const ChangePasswordModal = ({
  state,
  setState,
  currentPasswordRef,
  newPasswordRef,
  newConfirmedPasswordRef,
  isCurrentPasswordError,
  isNewPasswordError,
  errorMessage,
  passwordHandler,
}: ChangePasswordModalProps) => {
  useEscapeKey(() => setState(false));
  return (
    <Modal show={state} size="md" popup={true} onClose={() => setState(false)}>
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col">
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-center text-xl font-medium text-gray-900 dark:text-white">
              Reset Password
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="currentPassword" value="Current Password" />
              </div>
              <input
                ref={currentPasswordRef}
                id="currentPassword"
                placeholder="••••••••"
                required={true}
                type="password"
                className={`w-full rounded-md border-gray-300 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700  dark:bg-gray-200 dark:text-black focus:dark:border-gray-400 ${
                  isCurrentPasswordError ? 'border-rose-500 dark:border-rose-500' : ''
                }`}
              />
              {isCurrentPasswordError && (
                <span className="text-md px-2 text-red-500">{errorMessage}</span>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="New Password" />
              </div>
              <input
                ref={newPasswordRef}
                id="newPassword"
                placeholder="••••••••"
                required={true}
                type="password"
                className={`w-full rounded-md border-gray-300 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700  dark:bg-gray-200 dark:text-black focus:dark:border-gray-400 ${
                  isNewPasswordError ? 'border-rose-500 dark:border-rose-500' : ''
                }`}
              />
              {isNewPasswordError && (
                <span className="text-md px-2 text-red-500">{errorMessage}</span>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="newConfirmedPassword" value="Confirm Password" />
              </div>
              <input
                ref={newConfirmedPasswordRef}
                id="newConfirmedPassword"
                placeholder="••••••••"
                required={true}
                type="password"
                className={`w-full rounded-md border-gray-300 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700  dark:bg-gray-200 dark:text-black focus:dark:border-gray-400 ${
                  isNewPasswordError ? 'border-rose-500 dark:border-rose-500' : ''
                }`}
              />
              {isNewPasswordError && (
                <span className="text-md px-2 text-red-500">{errorMessage}</span>
              )}
            </div>
          </div>
          <Button onClick={passwordHandler} size="xl">
            Reset Password
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
