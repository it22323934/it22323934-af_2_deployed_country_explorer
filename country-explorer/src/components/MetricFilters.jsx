import { Button } from 'flowbite-react';

export default function MetricFilters({ activeMetric, setActiveMetric }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button.Group>
        <Button 
          color={activeMetric === 'population' ? 'blue' : 'gray'}
          onClick={() => setActiveMetric('population')}
        >
          Population
        </Button>
        <Button 
          color={activeMetric === 'area' ? 'blue' : 'gray'}
          onClick={() => setActiveMetric('area')}
        >
          Area
        </Button>
        <Button 
          color={activeMetric === 'density' ? 'blue' : 'gray'}
          onClick={() => setActiveMetric('density')}
        >
          Density
        </Button>
      </Button.Group>
    </div>
  );
}