import { useRef, useEffect, useCallback } from 'react';
import { Button } from 'flowbite-react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import * as d3 from 'd3';
import MetricFilters from './MetricFilters';

export default function PopulationChart({ filteredCountries, activeMetric, setActiveMetric, isDarkMode }) {
  const chartRef = useRef(null);
  
  const exportChart = useCallback(() => {
    const svgElement = chartRef.current.querySelector('svg');
    if (!svgElement) return;
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `countries-by-${activeMetric}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [activeMetric]);
  
  const getMetricData = useCallback(() => {
    switch (activeMetric) {
      case 'area':
        return filteredCountries
          .filter(c => c.area)
          .sort((a, b) => b.area - a.area)
          .slice(0, 10);
      case 'density':
        return filteredCountries
          .filter(c => c.area && c.area > 0)
          .map(c => ({...c, density: c.population / c.area}))
          .sort((a, b) => b.density - a.density)
          .slice(0, 10);
      default: // population
        return filteredCountries
          .sort((a, b) => b.population - a.population)
          .slice(0, 10);
    }
  }, [filteredCountries, activeMetric]);

  const renderChart = useCallback(() => {
    // Clear any previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    const topCountries = getMetricData();
    if (!topCountries.length) return;
    
    const margin = { top: 50, right: 30, bottom: 90, left: 100 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG with responsive container
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X axis
    const x = d3.scaleBand()
      .range([0, width])
      .domain(topCountries.map(d => d.name.common))
      .padding(0.3);
    
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));
      
    // Apply dark mode to x-axis text
    xAxis.selectAll('text')
      .attr('transform', 'translate(-10,5)rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', isDarkMode ? '#e5e7eb' : '#374151'); // Dark mode text color
    
    xAxis.selectAll('path, line')
      .style('stroke', isDarkMode ? '#6b7280' : '#9ca3af'); // Dark mode axis line color
    
    const getValue = (d) => {
      switch (activeMetric) {
        case 'area': return d.area;
        case 'density': return d.population / d.area;
        default: return d.population;
      }
    };
    
    // Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(topCountries, d => getValue(d))])
      .range([height, 0]);
    
    const yAxis = svg.append('g')
      .call(d3.axisLeft(y).tickFormat(d => {
        if (activeMetric === 'density') {
          return d3.format('.1f')(d);
        }
        return d3.format('.2s')(d);
      }));
      
    // Apply dark mode to y-axis text  
    yAxis.selectAll('text')
      .style('fill', isDarkMode ? '#e5e7eb' : '#374151');
    
    yAxis.selectAll('path, line')
      .style('stroke', isDarkMode ? '#6b7280' : '#9ca3af');
    
    // Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', isDarkMode ? '#e5e7eb' : '#374151')
      .text(activeMetric === 'area' ? 'Area (km²)' : 
            activeMetric === 'density' ? 'People per km²' : 'Population');
            
    // X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', isDarkMode ? '#e5e7eb' : '#374151')
      .text('Countries');
    
    // Tooltip
    const tooltip = d3.select(chartRef.current)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('border-radius', '5px')
      .style('padding', '8px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', 100);
    
    // Bars
    svg.selectAll('bars')
      .data(topCountries)
      .enter()
      .append('rect')
      .attr('x', d => x(d.name.common))
      .attr('y', d => y(getValue(d)))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(getValue(d)))
      .attr('fill', isDarkMode ? '#3b82f6' : '#3b82f6')
      .attr('class', 'transition-all duration-500')
      .attr('role', 'graphics-symbol')
      .attr('aria-roledescription', 'bar')
      .attr('aria-label', d => `${d.name.common}: ${getValue(d).toLocaleString()}`)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', isDarkMode ? '#60a5fa' : '#60a5fa');
        
        let tooltipText = '';
        if (activeMetric === 'population') {
          tooltipText = `${d.name.common}<br>Population: ${d.population.toLocaleString()}`;
        } else if (activeMetric === 'area') {
          tooltipText = `${d.name.common}<br>Area: ${d.area.toLocaleString()} km²`;
        } else {
          tooltipText = `${d.name.common}<br>Density: ${(d.population / d.area).toLocaleString(undefined, {maximumFractionDigits: 2})} people/km²`;
        }
        
        tooltip
          .html(tooltipText)
          .style('opacity', 1)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 40}px`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('fill', isDarkMode ? '#3b82f6' : '#3b82f6');
        tooltip.style('opacity', 0);
      });
    
    // Add value labels on top of bars
    svg.selectAll('value-labels')
      .data(topCountries)
      .enter()
      .append('text')
      .attr('x', d => x(d.name.common) + x.bandwidth() / 2)
      .attr('y', d => y(getValue(d)) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', isDarkMode ? '#9ca3af' : '#4b5563')
      .text(d => {
        if (activeMetric === 'density') {
          return (d.population / d.area).toFixed(1);
        }
        const value = getValue(d);
        return value > 999999 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString();
      });
    
    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', isDarkMode ? '#f9fafb' : '#111827')
      .text(`Top 10 Countries by ${activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}`);
  }, [activeMetric, filteredCountries, isDarkMode, getMetricData]);

  useEffect(() => {
    if (filteredCountries.length > 0 && chartRef.current) {
      renderChart();
    }
  }, [filteredCountries, activeMetric, isDarkMode, renderChart]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Distribution by {activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}
          </h3>
          <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
            Compare the {activeMetric} of the top 10 countries.
          </p>
        </div>
        <Button 
          size="sm" 
          color="light" 
          onClick={exportChart}
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
      
      <MetricFilters 
        activeMetric={activeMetric} 
        setActiveMetric={setActiveMetric} 
      />
      
      <div 
        className="h-[450px] w-full" 
        ref={chartRef} 
        aria-label={`Chart showing top 10 countries by ${activeMetric}`}
      ></div>
    </div>
  );
}