import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets_frontend/assets';

const Header = () => {
  const navigate = useNavigate();
  const [speciality, setSpeciality] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { id: 'General physician', label: 'طبيب عام', icon: '🩺' },
    { id: 'Gynecologist', label: 'نسائية وتوليد', icon: '🤰' },
    { id: 'Dermatologist', label: 'جلدية وتجميل', icon: '✨' },
    { id: 'Pediatricians', label: 'طب الأطفال', icon: '👶' },
    { id: 'Neurologist', label: 'مخ وأعصاب', icon: '🧠' },
    { id: 'Gastroenterologist', label: 'جهاز هضمي', icon: '🥦' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (speciality) {
      navigate(`/doctors/${speciality}`);
    } else {
      navigate('/doctors');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className='relative w-full rounded-2xl md:rounded-3xl overflow-visible bg-cover bg-center py-16 md:py-24 lg:py-28 px-4 sm:px-8 md:px-16 flex flex-col items-center justify-center border border-gray-100 shadow-xs mb-16' 
      style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${assets.header_bg || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'})` }}
      dir='rtl'
    >
      
      <div className='w-full max-w-4xl flex flex-col items-center text-center gap-6 md:gap-8 z-20'>
        
        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight select-none font-["Cairo"]'>
          رعاية طبية متميزة وخدمات صحية موثوقة لجميع أفراد الأسرة.
        </h1>

        <form 
          onSubmit={handleSearch} 
          className='w-full max-w-3xl bg-white p-1.5 sm:p-2 rounded-full flex items-center gap-2 shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-slate-100 relative z-30'
        >
          <div className='flex-1 relative' ref={dropdownRef}>
            
            <div 
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full text-slate-900 text-sm md:text-base px-4 sm:px-5 py-2.5 rounded-full cursor-pointer flex items-center justify-between transition-all duration-200
                ${isOpen ? 'bg-slate-50' : 'bg-transparent hover:bg-slate-50/50'}`}
            >
              <div className='flex items-center gap-3 select-none'>
                <span className='text-lg filter drop-shadow-xs text-slate-700 shrink-0'>
                  {options.find(opt => opt.id === speciality)?.icon || (
                    <svg className='w-5 h-5 text-slate-800 font-black' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                    </svg>
                  )}
                </span>
                <span className={`font-extrabold text-right tracking-wide ${speciality ? 'text-slate-900' : 'text-slate-400'}`}>
                  {options.find(opt => opt.id === speciality)?.label || 'ابحث عن تخصص الطبيب المطلوب...'}
                </span>
              </div>
              
              <img 
                src={assets.dropdown_icon} 
                alt="arrow" 
                className={`w-2.5 h-2.5 mr-2 transition-transform duration-300 ${isOpen ? 'rotate-180 brightness-50' : 'brightness-75'}`} 
              />
            </div>

            {isOpen && (
              <div className='absolute top-[125%] left-0 right-0 bg-white border border-slate-100 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 grid grid-cols-1 sm:grid-cols-2 gap-1.5 animate-fadeIn min-w-70'>
                {options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => {
                      setSpeciality(option.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer font-bold text-xs md:text-sm transition-all duration-150 select-none border border-transparent
                      ${speciality === option.id 
                        ? 'bg-[#3a96b7] text-white' 
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#3a96b7]'}`}
                  >
                    <div className='flex items-center gap-2.5'>
                      <span className='text-base'>{option.icon}</span>
                      <span className='font-extrabold tracking-tight whitespace-nowrap'>{option.label}</span>
                    </div>

                    {speciality === option.id && (
                      <span className='text-white font-black text-xs ml-1'>✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className='bg-[#3a96b7] text-white font-extrabold text-sm md:text-base px-6 sm:px-9 py-2.5 sm:py-3 rounded-full hover:bg-[#2d7792] transition-all duration-200 active:scale-[0.97] whitespace-nowrap shadow-xs'
          >
            بحث سريع
          </button>
        </form>

      </div>
    </div>
  );
};

export default Header;