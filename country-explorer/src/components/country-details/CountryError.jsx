import React from 'react';
import { Alert, Button } from 'flowbite-react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function CountryError({ error, navigate }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Alert color="failure" icon={ExclamationCircleIcon}>
        <div className="flex flex-col gap-2">
          <span className="font-medium">{error}</span>
          <p className="text-sm">Redirecting to home page in 5 seconds...</p>
          <Button 
            onClick={() => navigate("/")} 
            color="failure" 
            size="xs"
          >
            Go to Home Page Now
          </Button>
        </div>
      </Alert>
    </div>
  );
}