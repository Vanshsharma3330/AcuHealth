import React, { useEffect, useState } from 'react'
import DoctorCard from '../../components/Doctors/DoctorCard'
import Testimonial from '../../components/Testimonial/Testimonial'
import { BASE_URL } from '../../config'
import useFetchData from '../../hooks/useFetchData'
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error'

const Doctors = () => {
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);

  const handleSearch = () => {
    setQuery(query.trim());
  }

  useEffect(()=>{
    const timeout = setTimeout(()=>{
      setDebounceQuery(query)
    }, 700)
    return ()=> clearTimeout(timeout)
  },[query])

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const {data:doctors, loading, error} = useFetchData(
    `${BASE_URL}/doctors${debounceQuery ? `?query=${debounceQuery}` : ''}`
  ) 

  if (isPageLoading) {
    return <Loader />;
  }

  return <>
    <section className='bg-[#fff9ea] py-8 sticky top-0 z-10'>
      <div className='container text-center'>
        <h2 className='heading'>
          Find a Doctor
        </h2>
        <div className='max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between'>
          <input
            type='search'
            className='py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-text placeholder: text-textColor' 
            placeholder='Search Doctor by name or specialization'
            value={query}
            onChange={e=>setQuery(e.target.value)}
          />
          <button className='btn mt-0 rounded-[0px] rounded-r-md' onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </section>

    <section className='py-8'>
      <div className="container">
        {loading && <Loader/>}
        {error && <Error/>}
        {!loading && !error && (
          <>
            {doctors.length === 0 ? (
              <div className='text-center py-10'>
                <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold'>
                  No doctors found matching your search criteria
                </h3>
                <p className='text__para mt-2'>
                  Try searching with different keywords or browse all doctors
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5'>
                {doctors.slice(0, 6).map((doctor) => (
                  <DoctorCard key={doctor._id} doctor={doctor}/>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>

    <section className='py-8'>
      <div className="container">
        <div className='xl:w-[470px] mx-auto'>
          <h2 className='heading text-center'>
            What our patients say
          </h2>
          <p className='text__para text-center'>
            World-class health services for all<br/> Receive expert, superior care through our exceptional health system.
          </p>
        </div>
        <Testimonial />
      </div>
    </section>
  </>
}

export default Doctors
