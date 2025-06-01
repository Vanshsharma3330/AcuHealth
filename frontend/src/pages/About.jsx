import React from 'react'

const About = () => {
  return (
    <section className='bg-[#fff9ea]'>
      <div className='container'>
        <div className='xl:w-[470px] mx-auto'>
          <h2 className='heading text-center'>
            About Us
          </h2>
          <p className='text__para text-center'>
            Learn more about our mission to provide accessible healthcare for everyone
          </p>
        </div>

        <div className='mt-8'>
          <div className='bg-white p-8 rounded-lg shadow-md mb-8'>
            <h3 className='text-[24px] leading-9 text-headingColor font-[700] mb-4'>
              Our Mission
            </h3>
            <p className='text__para'>
              We are committed to making healthcare accessible and convenient for everyone, eliminating the barriers of distance and time. Our platform connects you with top doctors from the comfort of your home, ensuring you receive the best care possible, anytime, anywhere.
            </p>
          </div>

          <div className='bg-white p-8 rounded-lg shadow-md mb-8'>
            <h3 className='text-[24px] leading-9 text-headingColor font-[700] mb-4'>
              Why Choose Us
            </h3>
            <ul className='list-disc pl-6 space-y-4'>
              <li className='text__para'>
                <strong>Expert Doctors:</strong> Access to a network of highly qualified and experienced medical professionals
              </li>
              <li className='text__para'>
                <strong>Convenient Care:</strong> Book appointments and receive consultations from anywhere, anytime
              </li>
              <li className='text__para'>
                <strong>Quality Service:</strong> Commitment to providing the highest standard of medical care
              </li>
              <li className='text__para'>
                <strong>Patient-First Approach:</strong> Personalized care tailored to your specific needs
              </li>
            </ul>
          </div>

          <div className='bg-white p-8 rounded-lg shadow-md'>
            <h3 className='text-[24px] leading-9 text-headingColor font-[700] mb-4'>
              Our Commitment
            </h3>
            <p className='text__para'>
              Whether you need a quick consultation or ongoing medical support, our dedicated team is here to provide you with personalized, high-quality care. We believe in making healthcare accessible to all, and our platform is designed to make your healthcare journey as smooth and efficient as possible.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About 