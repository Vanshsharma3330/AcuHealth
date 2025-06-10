import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import {RiLinkedinFill} from 'react-icons/ri';
import { AiFillYoutube , AiOutlineInstagram, AiFillGithub } from 'react-icons/ai';


const socialLinks = [
  {
    path : "https://www.youtube.com/@practo",
    icon : <AiFillYoutube className='group-hover:text-white w-4 h-5' />,  
  },
  {
    path : "https://github.com/Vanshsharma3330",
    icon : <AiFillGithub className='group-hover:text-white w-4 h-5' />,  
  },
  {
    path : "https://www.instagram.com/vanshsharma3330/",
    icon : <AiOutlineInstagram className='group-hover:text-white w-4 h-5' />,  
  },
  {
    path : "https://www.linkedin.com/in/vanshsharma3330/",
    icon : <RiLinkedinFill className='group-hover:text-white w-4 h-5' />,  
  },
];

const quickLinks01 = [
  {
    path : "/home",
    display : "Home",
  },
  {
    path : "/about",
    display : "About Us",
  },
  {
    path : "/services",
    display : "Services",
  },
  {
    path : "/contact",
    display : "Contact",
  },
];

const quickLinks02 = [
  {
    path : "/doctors",
    display : "Find a Doctor",
  },
  {
    path : "/locations",
    display : "Find a Location",
  },
];

const quickLinks03 = [
  {
    path : "/contact",
    display : "Contact Us",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return <footer className='pb-16 pt-10'>
    <div className="container">
      <div className='flex justify-between flex-col md:flex-row flex-wrap gap-[30px]'>
        <div>
          <img src={logo} alt=''/>
          <p className='text-[16px] leading-7 font-[400] text-textColor mt-4'>
            Copyright &copy; {year} developed by Vansh Sharma all rights reserved.
          </p>

          <div className='flex items-center gap-3 mt-4'>
            {socialLinks.map((link, index) => <Link to={link.path} key={index} target='_blank' className='w-9 h-9 border border-solid border-[#181A1E] rounded-full flex items-center justify-center group hover:bg-black hover:border-none'>
              {link.icon}
            </Link>)}
          </div>
        </div>

        <div>
          <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor'>
            Quick Links
          </h2>

          <ul>
            {quickLinks01.map((item, index)=>(
              <li key={index} className='mb-4'>
                <button 
                  onClick={() => handleNavigation(item.path)}
                  className='text-[16px] leading-7 font-[400] text-textColor hover:text-primaryColor'
                >
                  {item.display}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor'>
            I want to :
          </h2>

          <ul>
            {quickLinks02.map((item, index)=>(
              <li key={index} className='mb-4'>
                <button 
                  onClick={() => handleNavigation(item.path)}
                  className='text-[16px] leading-7 font-[400] text-textColor hover:text-primaryColor'
                >
                  {item.display}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor'>
            Support
          </h2>

          <ul>
            {quickLinks03.map((item, index)=>(
              <li key={index} className='mb-4'>
                <button 
                  onClick={() => handleNavigation(item.path)}
                  className='text-[16px] leading-7 font-[400] text-textColor hover:text-primaryColor'
                >
                  {item.display}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </footer>
}

export default Footer
