import { Toast as FlowbiteToast } from 'flowbite-react';
import { HiCheck } from 'react-icons/hi';
import { toast } from '../../redux/feats/globalSlice/globalSlice';
import { useAppDispatch } from '../../redux/store';
type ToastProps = {
    message: string;
}

const Toast = ({ message }: ToastProps) => {
    const dispatch = useAppDispatch();

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <FlowbiteToast className="border shadow-lg">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500 text-white shadow-md dark:bg-green-800 dark:text-green-200">
                    <HiCheck className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-semibold text-gray-800 dark:text-gray-300">
                    {typeof message === 'string' ? message : 'Invalid message'}
                </div>
                <FlowbiteToast.Toggle onClick={() => dispatch(toast(false))} />
            </FlowbiteToast>
        </div>

    );
}

export default Toast;