import { Card, Avatar, Badge } from 'flowbite-react';
import { GlobeAltIcon, CodeBracketIcon, CubeTransparentIcon, ServerIcon } from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 theme-transition">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Country Explorer</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your interactive gateway to exploring countries around the world with comprehensive data, 
            visualizations, and an engaging user experience.
          </p>
        </div>
        
        {/* Application Overview */}
        <Card className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <GlobeAltIcon className="h-7 w-7 mr-2 text-blue-500" />
            Discover Our World
          </h2>
          <p className="mb-4">
            Country Explorer is a modern web application designed to provide users with detailed information about 
            countries around the globe. Built with React and powered by the REST Countries API, the application 
            offers a seamless experience for exploring geographic, demographic, and cultural data.
          </p>
          
          <div className="mt-6">
            <img 
              src="/assets/World-Map-Board.jpg" 
              alt="World Map Illustration" 
              className="w-full h-auto rounded-lg shadow-md dark:opacity-90"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://originalmap.co.uk/wp-content/uploads/2019/08/World-Map-Board.jpg';
              }}
            />
          </div>
        </Card>
        
        {/* Key Features */}
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="transition-all hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Detailed Country Profiles</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access comprehensive information about countries including demographics, geography, languages, and more.
            </p>
          </Card>
          
          <Card className="transition-all hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Interactive Globe</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Explore countries through an interactive globe interface with smooth navigation and visual indicators.
            </p>
          </Card>
          
          <Card className="transition-all hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Advanced Statistics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Compare countries using dynamic charts and statistical analysis tools for population, area, and density.
            </p>
          </Card>
          
          <Card className="transition-all hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Favorites Collection</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Save your favorite countries for quick access and build your own custom collection.
            </p>
          </Card>
        </div>
        
        {/* Tech Stack */}
        <h2 className="text-2xl font-bold mb-6">Technology Stack</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-all hover:shadow-lg">
            <CodeBracketIcon className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Frontend</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge color="info">React</Badge>
              <Badge color="info">Redux</Badge>
              <Badge color="info">Tailwind CSS</Badge>
              <Badge color="info">Flowbite</Badge>
              <Badge color="info">React Router</Badge>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-all hover:shadow-lg">
            <ServerIcon className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">API & Data</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge color="success">REST Countries API</Badge>
              <Badge color="success">Axios</Badge>
              <Badge color="success">LocalStorage</Badge>
              <Badge color="success">JSON</Badge>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-all hover:shadow-lg">
            <CubeTransparentIcon className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Development Tools</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge color="purple">Vite</Badge>
              <Badge color="purple">ESLint</Badge>
              <Badge color="purple">Jest</Badge>
              <Badge color="purple">Git</Badge>
              <Badge color="purple">npm</Badge>
            </div>
          </div>
        </div>
        
        {/* Developer Information */}
        <Card className="mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">About the Project</h2>
              <p className="mb-4">
                Country Explorer was developed as a showcase project for modern web development practices. 
                It demonstrates the use of React, Redux, and modern UI components to create an intuitive and 
                responsive user experience.
              </p>
              <p>
                This project uses the REST Countries API as its data source, providing up-to-date information 
                about countries worldwide.
              </p>
            </div>
          </div>
        </Card>
        
        {/* How to Use */}
        <h2 className="text-2xl font-bold mb-6">How to Use Country Explorer</h2>
        
        <div className="space-y-4 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Search for Countries</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Use the search bar on the home page to find countries by name, capital, or region.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Explore Details</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Click on any country card to view detailed information including geography, demographics, languages, and more.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Click the heart icon on any country card to add it to your favorites for quick access later.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">View Statistics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Navigate to the Statistics page to compare countries using interactive charts and visualizations.
            </p>
          </div>
        </div>
        
        {/* Data Attribution */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center mb-12">
          <h3 className="text-xl font-semibold mb-3">Data Attribution</h3>
          <p className="mb-4">
            Country data provided by the <a href="https://restcountries.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">REST Countries API</a>.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This application is for educational and demonstration purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}