import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'flowbite-react';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function InfoBanner() {
  const [dismissed, setDismissed] = useState(false);
  // Access theme from Redux store
  const { theme } = useSelector(state => state.theme);

  if (dismissed) return null;

  return (
    <Alert
      color="info"
      className={`mb-6 ${theme === 'dark' ? 'dark' : ''}`}
      icon={InformationCircleIcon}
      onDismiss={() => setDismissed(true)}
    >
      <div className="flex items-center">
        <span className="font-medium mr-2">Interactive Globe Available!</span>
        <span>Explore countries by clicking directly on the 3D globe or switch to list view.</span>
      </div>
    </Alert>
  );
}