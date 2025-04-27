import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector(state => state.theme);
  
  useEffect(() => {
    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Optional: Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content', 
          theme === 'dark' ? '#1f2937' : '#f9fafb'
        );
      }
    });
  }, [theme]);
  
  return children;
}