import React from "react";
import { Link } from "react-router-dom";
import { Button, Spinner, Tooltip } from "flowbite-react";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function CountryNavigation({ handleRefresh, refreshing }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        as={Link}
        to="/"
        color="light"
        size="sm"
        data-testid="back-button"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Button
        color="light"
        size="sm"
        onClick={handleRefresh}
        disabled={refreshing}
        data-testid="refresh-button"
      >
        {refreshing ? (
          <Spinner size="sm" className="mr-2" />
        ) : (
          <ArrowPathIcon className="h-4 w-4 mr-1" />
        )}
        Refresh
      </Button>
    </div>
  );
}
