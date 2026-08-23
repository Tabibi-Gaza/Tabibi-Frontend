import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, ChevronLeft, X, Pill } from 'lucide-react';

export default function AdminPharmaceutical() {
    // 1. البيانات الابتدائية للأدوية بناءً على مواصفات التصميم والأسماء المذكورة
    const [medicines, setMedicines] = useState([
        { id: 1, name: 'Panadol 500mg' },
        { id: 2, name: 'Amoxicillin 250mg' },
        { id: 3, name: 'Insulin Glargine' },
        { id: 4, name: 'Ventolin Inhaler'},
        { id: 5, name: 'Lidocaine Jelly 2%' },
        { id: 6, name: 'Paracetamol 250mg' },
        { id: 7, name: 'Ibuprofen 400mg'},
    ]);

    // 2. حالات التحكم بالنافذة المنبثقة (Modal) للإضافة والتعديل
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' أو 'edit'
    const [currentMedId, setCurrentMedId] = useState(null);
    const [medNameInput, setMedNameInput] = useState('');

    // 3. التحكم بشريط التنقل الرقمي (Pagination)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // الحسابات الرياضية للتنقل التلقائي والإحصائيات
    const totalItems = medicines.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = medicines.slice(indexOfFirstItem, indexOfLastItem);

    // 4. دالات التحكم والعمليات التفاعلية (Actions)

    // فتح مودال الإضافة
    const openAddModal = () => {
        setModalMode('add');
        setMedNameInput('');
        setIsModalOpen(true);
    };

    // فتح مودال التعديل
    const openEditModal = (medicine) => {
        setModalMode('edit');
        setCurrentMedId(medicine.id);
        setMedNameInput(medicine.name);
        setIsModalOpen(true);
    };

    // حفظ الدواء الجديد أو المعدل
    const handleSaveMedicine = (e) => {
        e.preventDefault();
        if (!medNameInput.trim() ) return;

        if (modalMode === 'add') {
            const newMed = {
                id: Date.now(),
                name: medNameInput,
            };
            setMedicines([newMed, ...medicines]);
            setCurrentPage(1); // الانتقال للصفحة الأولى لرؤية الدواء الجديد فوراً
        } else if (modalMode === 'edit') {
            setMedicines(medicines.map(med =>
                med.id === currentMedId ? { ...med, name: medNameInput } : med
            ));
        }

        setIsModalOpen(false);
        setMedNameInput('');
    };

    // حذف دواء
    const handleDeleteMedicine = (id) => {
        const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا الدواء نهائياً؟");
        if (confirmDelete) {
            const updatedMedicines = medicines.filter(med => med.id !== id);
            setMedicines(updatedMedicines);

            // حماية التصفح الحالي إذا تم تفريغ الصفحة الأخيرة بالكامل
            const maxPage = Math.ceil(updatedMedicines.length / itemsPerPage) || 1;
            if (currentPage > maxPage) {
                setCurrentPage(maxPage);
            }
        }
    };

    return (
        <div className="w-full  font-['Tajawal'] flex flex-col gap-[32px] text-right relative" dir="rtl">

            {/* SECTION 1: Summary Statistics Card */}
                <div className="w-full bg-white/80 border border-[#C3C6D6] backdrop-blur-[4px] rounded-[12px] p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">

                {/* معلومات إجمالي الأدوية */}
                <div className="flex flex gap-3 items-center justify-center gap-1">
                    <span className="text-[20px] font-extrabold tracking-[0.6px] text-[#434654]">
                        إجمالي الأدوية
                    </span>
                    <span className="text-[30px] font-bold text-[#138C9F] ">
                        {totalItems}
                    </span>
                </div>

                {/* زر إضافة دواء جديد المقوس */}
                <button
                    onClick={openAddModal}
                    className="flex flex-row items-center justify-center gap-3 px-6 h-[44px] bg-[#138C9F] text-white rounded-full font-bold text-[15px] transition-all hover:bg-[#0f7282] shadow-[0px_10px_15px_-3px_rgba(0,61,155,0.2),0px_4px_6px_-4px_rgba(0,61,155,0.2)]"
                >
                    <span>إضافة دواء جديد</span>
                    <Plus className="w-3.5 h-3.5 text-white" />
                </button>

            </div>

            {/* SECTION 2: Main Content Table */}
            <div className="w-full bg-white/80 border border-[#C3C6D6] backdrop-blur-[4px] rounded-[12px] shadow-sm overflow-hidden flex flex-col min-h-[480px]">

                {/* عنوان الجدول العلوي */}
                <div className="w-full h-[61px] bg-white border-b border-[#C3C6D6] flex items-center justify-center relative">
                    <h3 className="text-[20px] font-bold text-[#138C9F]">
                        قائمة الأدوية
                    </h3>
                </div>

                {/* جدول عرض البيانات */}
                <div className="flex-1 overflow-y-auto overflow-x-auto">
                    <table className="w-full border-collapse">

                        {/* رأس الجدول الخفيف */}
                        <thead>
                            <tr className="bg-[#ecf8fa] border-b border-[#C3C6D6] h-[49px]">
                                <th className="p-3 md:p-4 text-sm md:text-[14px] md:text-[16px] font-bold text-[#138C9F] tracking-[0.6px] text-right w-1/2 pe-2 md:pe-12">
                                    اسم الدواء
                                </th>
                                <th className="p-3 md:p-4 text-sm md:text-[16px] font-bold text-[#138C9F] tracking-[0.6px] text-center w-1/2">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>

                        {/* محتوى الجدول الديناميكي */}
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((med) => (
                                    <tr key={med.id} className="h-[60px] border-b border-[#C3C6D6] last:border-0 hover:bg-[#ecf8fa]/50 transition-colors">

                                        {/* عمود اسم الدواء مع الباتش كمعلومات ثانوية عمودية */}
                                        <td className="p-2 text-right pe-2 md:pe-12">
                                            <div className="flex flex-col justify-center">
                                                <span className="text-[14px] font-bold text-[#138C9F] leading-[24px]">
                                                    {med.name}
                                                </span>
                                                
                                            </div>
                                        </td>

                                        {/* عمود الإجراءات (تعديل / حذف) */}
                                        <td className="p-2" dir="rtl">
                                            <div className="flex justify-center items-center gap-4">
                                                {/* زر التعديل بالقلم */}
                                                <button
                                                    onClick={() => openEditModal(med)}
                                                    className="p-2 text-[#138C9F] hover:bg-[#138C9F]/10 rounded-lg transition-colors"
                                                    title="تعديل"
                                                >
                                                    <Edit2 className="w-[18px] h-[18px]" />
                                                </button>

                                                {/* زر الحذف بالسلة */}
                                                <button
                                                    onClick={() => handleDeleteMedicine(med.id)}
                                                    className="p-2 text-[#BA1A1A] hover:bg-[#BA1A1A]/10 rounded-lg transition-colors"
                                                    title="حذف"
                                                >
                                                    <Trash2 className="w-[16px] h-[18px]" />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="p-12 text-center text-gray-400 font-bold">
                                        لا توجد أدوية مدرجة في النظام حالياً.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* SECTION 3: Dynamic Pagination Footer */}
                <div className="bg-white border-t border-[#C3C6D6] px-6 py-4 flex flex-row justify-between items-center h-[73px]">
  {/* جملة العرض الإحصائي السفلي */}
                    <div className="text-[14px] text-[#526069] font-bold">
                        عرض {totalItems === 0 ? 0 : indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} من إجمالي {totalItems} دواء
                    </div>
                    {/* محرك التنقل والأرقام التفاعلية */}
                    <div className="flex items-center gap-1.5">
                        {/* زر الصفحة التالية (يتحرك لليمين في لغة الـ RTL) */}
                       
 {/* زر الصفحة السابقة (يتحرك لليسار في لغة الـ RTL) */}
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                        </button>
                        {/* بناء أرقام الصفحات ديناميكياً */}
                        {Array.from({ length: totalPages }, (_, idx) => {
                            const pageNum = idx + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-10 h-10 font-extrabold rounded-[5px] flex items-center justify-center text-[16px] transition-colors ${currentPage === pageNum
                                            ? 'bg-[#138C9F] text-white'
                                            : 'bg-[#C3C6D6] text-black hover:bg-gray-400'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
<button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
                        </button> 
                       
                    </div>

                  

                </div>

            </div>

            {/* INTERACTIVE MODAL: نافذة إضافة وتعديل الدواء */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
                    <div className="bg-white w-full max-w-[calc(100%-2rem)] sm:max-w-[500px] rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 mx-4 relative text-right">

                        {/* إغلاق المودال من الإكس العلوي */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* ترويسة المودال */}
                        <div className="flex items-center justify-start gap-3 mb-6 mt-2">
                            <div className="w-8 h-8 bg-[#138C9F] text-white rounded-full flex items-center justify-center">
                                <Pill className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-[20px] font-bold text-[#0B1C30]">
                                    {modalMode === 'add' ? 'إضافة دواء جديد' : 'تعديل بيانات الدواء'}
                                </h3>
                                <p className="text-[13px] text-gray-500 font-medium">
                                    يرجى ملء الحقول التالية لتحديث الصيدلية الطبية بالنظام
                                </p>
                            </div>
                        </div>

                        {/* استمارة الإدخال وحفظ البيانات */}
                        <form onSubmit={handleSaveMedicine} className="space-y-5">

                            {/* حقل اسم الدواء */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#138C9F]">اسم الدواء</label>
                                <input
                                    type="text"
                                    value={medNameInput}
                                    onChange={(e) => setMedNameInput(e.target.value)}
                                    placeholder="مثال: Panadol 500mg"
                                    className="w-full h-[48px] px-4 border border-[#C3C6D6] rounded-xl focus:outline-none focus:border-[#138C9F] font-semibold text-[#0B1C30] text-right"
                                    required
                                />
                            </div>

                          

                            {/* أزرار الإجراءات داخل المودال */}
                            <div className="flex items-center justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 h-[44px] border border-[#138C9F] text-[#138C9F] rounded-xl font-bold hover:bg-gray-50 transition-colors w-1/3"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 h-[44px] bg-[#138C9F] text-white rounded-xl font-bold hover:bg-[#0f7282] transition-colors flex-1"
                                >
                                    {modalMode === 'add' ? 'إضافة الدواء' : 'حفظ التعديلات'}
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}