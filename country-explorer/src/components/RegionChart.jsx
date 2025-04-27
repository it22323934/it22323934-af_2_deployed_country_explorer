import { useRef, useEffect, useCallback } from 'react';
import { Button } from 'flowbite-react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import * as d3 from 'd3';

export default function RegionChart({ filteredCountries, isDarkMode }) {
  const chartRef = useRef(null);
  
  const exportChart = useCallback(() => {
    const svgElement = chartRef.current.querySelector('svg');
    if (!svgElement) return;
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'countries-by-region.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const renderChart = useCallback(() => {
    // Clear any previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Group countries by region and count
    const regionCounts = {};
    filteredCountries.forEach(country => {
      if (!regionCounts[country.region]) {
        regionCounts[country.region] = 0;
      }
      regionCounts[country.region]++;
    });
    
    const data = Object.entries(regionCounts)
      .filter(([region]) => region) // Filter out undefined regions
      .map(([region, count]) => ({
        region,
        count
      }));
    
    if (!data.length) return;
    
    const width = chartRef.current.clientWidth;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    
    // Create SVG with responsive container
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    
    // Color scale with better accessibility
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.region))
      .range([
        '#2563eb', '#7c3aed', '#db2777', '#f59e0b', '#10b981',
        '#0891b2', '#4338ca', '#be123c', '#92400e', '#047857'
      ]);
    
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
    
    // Pie chart
    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);
    
    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8)
      .padAngle(0.02)
      .cornerRadius(4);
    
    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);
    
    // Add title
    svg.append('text')
      .attr('x', 0)
      .attr('y', -height / 2 + 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', isDarkMode ? '#f9fafb' : '#111827')
      .text('Countries by Region');
    
    // Add central text
    const centralText = svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', isDarkMode ? '#f9fafb' : '#111827')
      .text(filteredCountries.length);
    
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.8em')
      .style('font-size', '12px')
      .style('fill', isDarkMode ? '#e5e7eb' : '#374151')
      .text('Countries');
    
    // Add arcs with transitions
    const paths = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.region))
      .attr('stroke', isDarkMode ? '#1f2937' : 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.8)
      .attr('role', 'graphics-symbol')
      .attr('aria-label', d => `${d.data.region}: ${d.data.count} countries`)
      .attr('class', 'transition-all duration-300')
      .on('mouseover', function(event, d) {
        const percentage = ((d.data.count / filteredCountries.length) * 100).toFixed(1);
        
        d3.select(this)
          .style('opacity', 1)
          .attr('transform', 'scale(1.03)');
        
        centralText.text(`${percentage}%`);
        
        tooltip
          .html(`${d.data.region}<br>${d.data.count} countries<br>${percentage}% of total`)
          .style('opacity', 1)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 40}px`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .style('opacity', 0.8)
          .attr('transform', 'scale(1)');
          
        centralText.text(filteredCountries.length);
        tooltip.style('opacity', 0);
      });
    
    // Add labels
    const labels = svg.selectAll('label')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('dy', '.35em')
      .text(d => `${d.data.region} (${d.data.count})`)
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
      .style('font-size', '12px')
      .style('fill', isDarkMode ? '#e5e7eb' : '#374151');
    
    // Add polylines with animations
    svg.selectAll('polyline')
      .data(pie(data))
      .enter()
      .append('polyline')
      .attr('points', d => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      })
      .style('fill', 'none')
      .style('stroke', isDarkMode ? '#6b7280' : 'gray')
      .style('opacity', 0.5)
      .style('stroke-width', 1);
    
    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
  }, [filteredCountries, isDarkMode]);

  useEffect(() => {
    if (filteredCountries.length > 0 && chartRef.current) {
      renderChart();
    }
  }, [filteredCountries, isDarkMode, renderChart]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Regional Distribution</h3>
          <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
            Distribution of countries across different regions of the world.
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
      
      <div 
        className="h-[450px] w-full" 
        ref={chartRef} 
        aria-label="Pie chart showing distribution of countries by region"
      ></div>
    </div>
  );
}