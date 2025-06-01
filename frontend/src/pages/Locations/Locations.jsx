import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import Map from '../../components/Map/Map';

const locations = [
  {
    id: 1,
    name: 'Downtown Medical Center',
    address: '123 Main Street, Downtown',
    phone: '(555) 123-4567',
    hours: 'Mon-Fri: 8:00 AM - 8:00 PM, Sat: 9:00 AM - 5:00 PM',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 2,
    name: 'Westside Clinic',
    address: '456 West Avenue, Westside',
    phone: '(555) 234-5678',
    hours: 'Mon-Fri: 7:00 AM - 7:00 PM, Sat: 8:00 AM - 4:00 PM',
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: 3,
    name: 'Eastside Medical Hub',
    address: '789 East Road, Eastside',
    phone: '(555) 345-6789',
    hours: 'Mon-Fri: 8:30 AM - 8:30 PM, Sat: 9:30 AM - 5:30 PM',
    coordinates: { lat: 40.7282, lng: -73.7949 }
  }
];

const Locations = () => {
  const handleGetDirections = (coordinates) => {
    const { lat, lng } = coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <section className='bg-[#fff9ea]'>
      <div className='container'>
        <h2 className='heading text-center'>Our Locations</h2>
        <p className='text__para text-center'>
          Find the nearest clinic to you and get the care you deserve
        </p>

        {/* Map Section */}
        <div className='mt-8'>
          <Map locations={locations} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8'>
          {locations.map((location) => (
            <div key={location.id} className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
              <h3 className='text-xl font-bold text-headingColor mb-4'>{location.name}</h3>
              
              <div className='space-y-3'>
                <div className='flex items-start gap-3'>
                  <FaMapMarkerAlt className='text-primaryColor mt-1' />
                  <p className='text-textColor'>{location.address}</p>
                </div>
                
                <div className='flex items-start gap-3'>
                  <FaPhone className='text-primaryColor mt-1' />
                  <p className='text-textColor'>{location.phone}</p>
                </div>
                
                <div className='flex items-start gap-3'>
                  <FaClock className='text-primaryColor mt-1' />
                  <p className='text-textColor'>{location.hours}</p>
                </div>
              </div>

              <button 
                className='btn mt-4 w-full'
                onClick={() => handleGetDirections(location.coordinates)}
              >
                Get Directions
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations; 