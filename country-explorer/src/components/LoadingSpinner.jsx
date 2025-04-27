import { Spinner } from 'flowbite-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-[70vh]">
      <Spinner size="xl" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading data...</p>
    </div>
  );
}