import {useState, useRef, useEffect, useContext} from 'react'
import logo from '../../assets/images/logo.png';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {BiMenu} from 'react-icons/bi'
import { authContext } from '../../context/AuthContext';

const navLinks = [
  {
    path: '/home',
    display: 'Home'
  },
  {
    path: '/doctors',
    display: 'Find a Doctor'
  },
  {
    path: '/services',
    display: 'Services'
  },
  {
    path: '/contact',
    display: 'Contact'
  },
]

const Header = () => {

  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const {user, role, token, dispatch} = useContext(authContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleStickyHeader = () => {
    window.addEventListener('scroll', ()=>{
      if(document.body.scrollTop > 80 || document.documentElement.scrollTop > 80){
        headerRef.current.classList.add('sticky__header');
      }
      else{
        headerRef.current.classList.remove('sticky__header');
      }
    })
  }

  useEffect(()=>{
    handleStickyHeader();
    return()=>window.removeEventListener('scroll', handleStickyHeader)
  })

  const toggleMenu = () => menuRef.current.classList.toggle('show__menu')

  const handleLogout = () => {
    dispatch({type: 'LOGOUT'});
    navigate('/login');
  }

  return <header className='header flex items-center' ref={headerRef}>
    <div className="container">
      <div className='flex items-center justify-between'>
        {/* =================== LOGO ================== */}
        <div>
          <Link to="/home">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        {/* =================== MENU ================== */}
        <div className='navigation' ref={menuRef} onClick={toggleMenu}>
          <ul className="menu flex items-center gap-[2.7rem]">
            {
              navLinks.map((link, index)=><li key={index}>
                <NavLink 
                  to={link.path} 
                  className={navClass=> 
                    navClass.isActive
                    ? 'text-primaryColor text-[16px] leading-7 font-[600]' 
                    : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor'
                  }
                >
                  {link.display}
                </NavLink>
              </li>)
            }
          </ul>
        </div>  

        {/* =================== NAV RIGHT ================== */}
        <div className='flex items-center gap-4'>
            {
              token && user ? (
                <div className='relative'>
                  <div 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className='cursor-pointer'
                  >
                    <figure className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                      <img className='w-full h-full object-cover' src={user?.photo} alt='' />
                    </figure>
                  </div>

                  {showDropdown && (
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50'>
                      <Link 
                        to={`${role === 'doctor' ? '/doctors/profile/me' : '/users/profile/me'}`}
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to='/login'>
                  <button className='bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]'>
                    Login
                  </button>
                </Link>
              )
            }

          <span className='md:hidden' onClick={toggleMenu}>
            <BiMenu className='w-6 h-6 cursor-pointer' />
          </span>
        </div>
      </div>
    </div>
  </header>
}

export default Header
