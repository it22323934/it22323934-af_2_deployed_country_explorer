import { Spinner } from 'flowbite-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Spinner size="xl" color="info" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading content...</p>
    </div>
  );
}