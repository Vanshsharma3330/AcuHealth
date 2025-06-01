import React from 'react'
import aboutImg from '../../assets/images/about.png';
import aboutCardImg from '../../assets/images/about-card.png';
import { Link } from 'react-router-dom';

const About = () => {
  return <section>
    <div className="container">
        <div className='flex justify-between gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row'>
            {/* ============= About Image ==============*/}
            <div className='relative w-3/4 lg:w-1/2 xl:w-[770px] z-10 order-2 lg:order-1'>
                <img src={aboutImg} alt='' />
                <div className='absolute z-20 bottom-4 w-[200px] md:w-[300px] right-[-30%] md:right-[-7%] lg:right-[22%]'>
                    <img src={aboutCardImg} />
                </div>
            </div>

            {/* ============= About content ==============*/}
            <div className='w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2'>
                <h2 className='heading'>Proud to be one of the nations best</h2>
                <p className='text__para'>We are committed to making healthcare accessible and convenient for everyone, eliminating the barriers of distance and time. </p>
                <p className='text__para mt-[30px]'>Our platform connects you with top doctors from the comfort of your home, ensuring you receive the best care possible, anytime, anywhere. Whether you need a quick consultation or ongoing medical support, our dedicated team is here to provide you with personalized, high-quality care.</p>
                <Link to='/about' className='inline-block' onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/about';
                }}>
                    <button className='btn'>Learn More</button>
                </Link>
            </div>
        </div>
    </div>
  </section>
}

export default About
