import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Badge } from 'flowbite-react';
import { 
  GlobeAltIcon, CurrencyDollarIcon, LanguageIcon, 
  MapPinIcon, UsersIcon 
} from '@heroicons/react/24/outline';

import CountryHeader from './tabs/CountryHeader';
import GeneralTab from './tabs/GeneralTab';
import CurrencyTab from './tabs/CurrencyTab';
import LanguagesTab from './tabs/LanguagesTab';
import BordersTab from './tabs/BordersTab';
import DemographicsTab from './tabs/DemographicsTab';

export default function CountryInfoSection({ country }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: '10%',
    left: '0%'
  });
  
  // Update indicator position when active tab changes
  useEffect(() => {
    if (tabsRef.current) {
      const tabsContainer = tabsRef.current;
      const activeTabElement = tabsContainer.querySelector('[aria-selected="true"]');
      
      if (activeTabElement) {
        const tabsContainerRect = tabsContainer.getBoundingClientRect();
        const activeTabRect = activeTabElement.getBoundingClientRect();
        
        // Calculate relative position and width based on the container
        const width = (activeTabRect.width / tabsContainerRect.width) * 100;
        const left = ((activeTabRect.left - tabsContainerRect.left) / tabsContainerRect.width) * 100;
        
        setIndicatorStyle({
          width: `${width}%`,
          left: `${left}%`
        });
      }
    }
  }, [activeTab]);
  
  return (
    <div className="dark:text-white">
      {/* Enhanced header with animation and better spacing */}
      <div className="mb-8 animate-fade-in-down">
        <CountryHeader country={country} />
      </div>
      
      {/* Improved tab container with enhanced shadows and corners */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all border border-gray-100 dark:border-gray-700">
        {/* Enhanced tab bar with gradient background */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto scrollbar-hide" ref={tabsRef}>
            <Tabs 
              aria-label="Country information tabs" 
              style="underline"
              className="custom-tabs w-full"
              onActiveTabChange={setActiveTab}
            >
              <Tabs.Item 
                title={
                  <span className="flex items-center gap-2 font-medium">
                    <GlobeAltIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    General
                  </span>
                } 
                active
                className="focus:ring-0"
              >
                <div className="animate-fade-in p-5 transition-all">
                  <GeneralTab country={country} />
                </div>
              </Tabs.Item>
              
              <Tabs.Item 
                title={
                  <span className="flex items-center gap-2 font-medium">
                    <CurrencyDollarIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                    Currency
                  </span>
                }
                className="focus:ring-0"
              >
                <div className="animate-fade-in p-5 transition-all">
                  <CurrencyTab country={country} />
                </div>
              </Tabs.Item>
              
              <Tabs.Item 
                title={
                  <span className="flex items-center gap-2 font-medium">
                    <LanguageIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    Languages
                  </span>
                }
                className="focus:ring-0"
              >
                <div className="animate-fade-in p-5 transition-all">
                  <LanguagesTab country={country} />
                </div>
              </Tabs.Item>
              
              <Tabs.Item 
                title={
                  <span className="flex items-center gap-2 font-medium">
                    <MapPinIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
                    Borders
                  </span>
                }
                className="focus:ring-0"
              >
                <div className="animate-fade-in p-5 transition-all">
                  <BordersTab country={country} />
                </div>
              </Tabs.Item>
              
              <Tabs.Item 
                title={
                  <span className="flex items-center gap-2 font-medium">
                    <UsersIcon className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                    Demographics
                  </span>
                }
                className="focus:ring-0"
              >
                <div className="animate-fade-in p-5 transition-all">
                  <DemographicsTab country={country} />
                </div>
              </Tabs.Item>
            </Tabs>
          </div>
        </div>
        
        {/* Enhanced tab indicator bar with glowing effect - fixed to match actual tab widths */}
        <div className="bg-gray-100 dark:bg-gray-700/50 h-1.5 relative">
          <div 
            className="absolute h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 
                      transition-all duration-300 ease-in-out shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            style={indicatorStyle}
          />
        </div>
      </div>
      

    </div>
  );
}