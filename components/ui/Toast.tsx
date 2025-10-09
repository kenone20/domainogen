import React from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { ToastType } from '../../context/ToastContext';

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />,
  error: <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />,
  info: <InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />,
};

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  return (
    <div className="max-w-sm w-full bg-white dark:bg-brand-gray shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden animate-fade-in">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onDismiss}
              className="inline-flex rounded-md bg-white dark:bg-brand-gray text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-dark focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;