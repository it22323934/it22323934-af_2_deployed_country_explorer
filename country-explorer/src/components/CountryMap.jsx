export default function CountryMap({ lat, lng, name }) {
    // Using a free map embedding service
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-10}%2C${lat-10}%2C${lng+10}%2C${lat+10}&amp;layer=mapnik&amp;marker=${lat}%2C${lng}`;
    
    return (
      <div className="w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight="0" 
          marginWidth="0" 
          src={mapUrl} 
          title={`Map of ${name}`}
          className="border-0"
        ></iframe>
      </div>
    );
  }