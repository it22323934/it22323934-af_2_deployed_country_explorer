import { useCallback } from 'react';
import CountryCard from './CountryCard';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

export default function VirtualizedCountryList({ countries }) {
  // Calculate column count based on screen width
  const getColumnCount = (width) => {
    if (width < 768) return 1;
    if (width < 1024) return 2;
    if (width < 1280) return 3;
    return 4;
  };
  
  // Cell renderer for virtualized grid
  const Cell = useCallback(({ columnIndex, rowIndex, style, data }) => {
    const { countries, columnCount } = data;
    const index = rowIndex * columnCount + columnIndex;
    
    if (index >= countries.length) {
      return null;
    }
    
    const country = countries[index];
    
    return (
      <div style={{
        ...style,
        padding: '1rem',
      }}>
        <CountryCard 
          country={country} 
          data-testid={`country-card-${country.cca3}`} 
        />
      </div>
    );
  }, []);

  return (
    <div style={{ height: '800px', width: '100%' }} className="mt-8">
      <AutoSizer>
        {({ height, width }) => {
          const columnCount = getColumnCount(width);
          const rowCount = Math.ceil(countries.length / columnCount);
          
          return (
            <FixedSizeGrid
              columnCount={columnCount}
              columnWidth={width / columnCount}
              height={height}
              rowCount={rowCount}
              rowHeight={320}
              width={width}
              itemData={{ countries, columnCount }}
            >
              {Cell}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
    </div>
  );
}