import React, { useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors } = useContext(AppContext)

  {/* حساب معلومات الطبيب مباشرة أثناء الرندر بناءً على الـ docId والـ doctors */}
  const docInfo = useMemo(() => {
    return doctors.find(doc => doc._id === docId)
  }, [doctors, docId])

  {/* حماية للمكون في حال لم يتم العثور على الطبيب أو البيانات ما زالت تحتمل التحميل */}
  if (!docInfo) {
    return <div className='text-center mt-10 text-gray-500'>Loading doctor info...</div>
  }
  return (
    <div>

    </div>
  )
}

export default Appointment