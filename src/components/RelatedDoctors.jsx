import React, { useContext, useMemo } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext)
    const navigate = useNavigate()

    // فرز وتصفية الأطباء ذوي الصلة
    const relDocs = useMemo(() => {
        if (doctors && doctors.length > 0 && speciality) {
            return doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
        }
        return []
    }, [doctors, speciality, docId])

    return (
        <div className='flex flex-col items-center gap-3 my-12 text-gray-900 text-right' dir='rtl'>
            <div className='text-center mb-4'>
                <h2 className='text-2xl font-bold text-gray-800'>أطباء ذو صلة</h2>
                <p className='text-xs text-gray-400 mt-1'>تصفح قائمة الأطباء الموثوقين لدينا في نفس التخصص.</p>
            </div>

            {/* شبكة البطاقات الثلاثية */}
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2 px-2 sm:px-0'>
                {relDocs.slice(0, 3).map((item, index) => (
                    <div 
                        key={index}
                        onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }} 
                        className='border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col'
                    >
                        {/* حاوية الصورة وشارة التوفر المتموضعة في أعلى اليمين absolute top-3 right-3 */}
                        <div className='relative bg-[#f4faff] pt-4 flex justify-center h-48 overflow-hidden'>
                            <span className='absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm bg-white text-gray-500'>
                                <span className='w-1.5 h-1.5 rounded-full bg-gray-400'></span>
                                غير متاح
                            </span>
                            <img className='h-full object-contain' src={item.image} alt={item.name} />
                        </div>

                        {/* معلومات الكرت السفلي */}
                        <div className='p-4 flex-1 flex flex-col justify-between'>
                            <div>
                                <div className='flex justify-between items-center mb-1'>
                                    <h3 className='text-base font-bold text-gray-800'>{item.name}</h3>
                                    {/* النجوم والتقييم */}
                                    <div className='flex items-center gap-0.5 text-[10px] text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md'>
                                        <span>★</span>
                                        <span>4.8</span>
                                    </div>
                                </div>
                                <p className='text-[#00a699] text-xs font-medium mb-3'>{item.speciality}</p>
                                
                                <div className='flex flex-col gap-1 text-[11px] text-gray-400 border-t border-gray-50 pt-2'>
                                    <p className='flex items-center gap-1'>📍 {item.address?.line1 }</p>
                                    <p className='flex items-center gap-1'>🕒 سنوات خبرة {item.experience}</p>
                                </div>
                            </div>

                            <button className='w-full mt-4 bg-[#00a699] hover:bg-[#008f84] text-white py-2 rounded-xl font-medium text-xs transition-colors duration-200 shadow-sm'>
                                احجز الآن
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RelatedDoctors