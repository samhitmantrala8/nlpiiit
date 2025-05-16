import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Card from '../components/Card';
import iiit1 from '../assets/iiit1.jpg';
import iiit2 from '../assets/iiit2.jpg';
import iiit3 from '../assets/iiit3.jpg';
import iiit4 from '../assets/iiit4.jpg';
import iiit5 from '../assets/iiit5.jpeg';
import iiit6 from '../assets/iiit6.jpeg';
import iiit7 from '../assets/iiit7.jpeg';
import iiit8 from '../assets/iiit8.jpeg';

const api = {
  key: "b8b41ca4261db802d75988da80343df6",
  base: "https://api.openweathermap.org/data/2.5/",
};

const slides = [
  iiit1,
  iiit5,
  iiit6,
  iiit8,
];

const cardData = [
  { id: 1, image: iiit1, title: 'Virtual Campus Tour', desc: 'Explore the campus virtually.', link: '/vctour' },
  { id: 2, image: iiit2, title: 'General Info', desc: 'Get general information about the college regarding campus life, fests, hostels, canteens.', link: '/geninfo' },
  { id: 3, image: iiit3, title: 'Cultural Clubs', desc: 'Learn about the cultural clubs.', link: '/cultural' },
  { id: 4, image: iiit4, title: 'Sports Clubs', desc: 'Get to know the sports clubs.', link: '/sports' },
  { id: 5, image: iiit5, title: 'Placement Info', desc: 'Information on placements.', link: '/placements' },
  { id: 6, image: iiit6, title: 'Technical Clubs', desc: 'Explore the technical clubs.', link: '/technical' },
  { id: 7, image: iiit8, title: 'Academics', desc: 'Academic resources and information.', link: '/academics' },
];

const collegeCoords = {
  lat: 23.1735296,
  lon: 80.0161792
};

const haversineDistance = (coords1, coords2, unit = 'km') => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const lat1 = toRadians(coords1.lat);
  const lon1 = toRadians(coords1.lon);
  const lat2 = toRadians(coords2.lat);
  const lon2 = toRadians(coords2.lon);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const R = unit === 'km' ? 6371 : 3958.8; // Radius of the Earth in kilometers or miles
  return R * c; // Distance in the specified unit
};

export default function Home() {
  const [search, setSearch] = useState("Jabalpur");
  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [distanceKm, setDistanceKm] = useState(null);
  const [distanceMiles, setDistanceMiles] = useState(null);

  const searchPressed = () => {
    fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        setWeather(result);
      });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setLocation(userLocation);
        const km = haversineDistance(collegeCoords, userLocation, 'km');
        const miles = haversineDistance(collegeCoords, userLocation, 'miles');
        setDistanceKm(km);
        setDistanceMiles(miles);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);
  // console.log(location);

  useEffect(() => {
    searchPressed();
  }, [searchPressed]);

  return (
    <div>
      {/* top */}
      <div className='flex py-28 px-6 md:py-20 max-w-6xl mx-auto bg-transparent rounded-lg'>
        {/* first */}
        <div className='p-5 text-center md:py-8 flex flex-col lg:gap-7 bg-white rounded-lg'>
          <h1 className='text-slate-700 font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4'>
            Ask anything! with <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              iiitdmChat
            </span>
          </h1>
          <div className='text-gray-400 text-xs sm:text-sm mb-6 lg:text-lg'>
            Welcome to the official website of iiitdmChat, where you can explore all the essential information about our esteemed institution. Our website features an interactive chatbot that can provide answers to your queries about IIITDMJ, from academic programs to campus facilities. Whether you are a prospective student, a current student, or an alumnus, our chatbot is here to assist you 24/7. Discover the vibrant community and state-of-the-art infrastructure that make IIITDMJ a hub of innovation and learning.
          </div>
          {typeof weather.main !== "undefined" && (
            <div className='flex flex-col rounded-sm sm:flex-row items-center bg-gray-200 py-1 md:py-3 md:mt-1 xl:mt-9 md:px-10 lg:px-4'>
              <div className='flex-1 text-center'>
                <p className='text-lg font-medium lg:text-xl xl:text-2xl'>{weather.name}</p>
              </div>
              <div className='flex-1 text-center'>
                <p className='text-lg md:text-xl'>{weather.main.temp}°C</p>
                <p className='text-sm'>{weather.weather[0].main} ({weather.weather[0].description})</p>
              </div>
              {distanceKm !== null && distanceMiles !== null && (
                <div className='flex-1 text-center'>
                  <p className='text-lg md:text-xl'>Distance to College:</p>
                  <p className='text-sm'>
                    {distanceKm.toFixed(2)} km | {distanceMiles.toFixed(2)} miles
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* second */}
        <div className='md:max-w-xs lg:max-w-sm xl:max-w-md hidden md:block'>
          <Carousel>
            {slides.map((s, i) => (
              <img key={i} src={s} alt="img" className='rounded-lg md:h-[460px] lg:h-[560px] xl:h-[600px]' />
            ))}
          </Carousel>
        </div>

      </div>

      {/* cards section */}
      <div className='max-w-6xl mx-auto p-3 my-10 bg-transparent rounded-lg'>
        <div className="grid grid-cols-1 text-center sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
          {cardData.map((card, i) => (
            <Link key={i} to={card.link}>
              <Card key={card.id} image={card.image} title={card.title} desc={card.desc} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
