import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Layers, ChevronRight, ChevronLeft, X, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useAdminSpecializationsQuery,
  useCreateSpecialization,
  useUpdateSpecialization,
  useDeleteSpecialization,
  useToggleSpecializationStatus,
} from '../../queries/specializations/specializationQueries';

export default function AdminDepartmentsManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 10;

    const queryParams = { page: currentPage, pageSize: itemsPerPage, search: searchQuery || undefined, sortBy: 'Name', sortOrder: 'Asc' };

    const { data, isLoading } = useAdminSpecializationsQuery(queryParams);

    const createMut = useCreateSpecialization();
    const updateMut = useUpdateSpecialization();
    const deleteMut = useDeleteSpecialization();
    const toggleMut = useToggleSpecializationStatus();

    const departments = data?.items || [];
    const totalItems = data?.totalCount || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentDeptId, setCurrentDeptId] = useState(null);
    const [deptNameInput, setDeptNameInput] = useState('');

    const totalActiveDepartments = departments.filter(d => d.isActive).length;
    const totalDoctors = departments.reduce((acc, curr) => acc + (curr.doctorCount || 0), 0);
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

    const openAddModal = () => { setModalMode('add'); setDeptNameInput(''); setIsModalOpen(true); };
    const openEditModal = (dept) => { setModalMode('edit'); setCurrentDeptId(dept.id); setDeptNameInput(dept.name); setIsModalOpen(true); };

    const handleSaveDepartment = async (e) => {
        e.preventDefault();
        if (!deptNameInput.trim()) return;

        try {
            if (modalMode === 'add') {
                const res = await createMut.mutateAsync(deptNameInput.trim());
                if (res.succeeded) toast.success('تمت إضافة القسم بنجاح.');
                else toast.error(res.errors?.[0]?.message || 'فشل إضافة القسم.');
            } else {
                const res = await updateMut.mutateAsync({ id: currentDeptId, name: deptNameInput.trim() });
                if (res.succeeded) toast.success('تم تعديل القسم بنجاح.');
                else toast.error(res.errors?.[0]?.message || 'فشل تعديل القسم.');
            }
            setIsModalOpen(false);
            setDeptNameInput('');
        } catch (error) {
            toast.error(error.response?.data?.errors?.[0]?.message || 'حدث خطأ.');
        }
    };

    const handleDeleteDepartment = async (id) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
        try {
            const res = await deleteMut.mutateAsync(id);
            if (res.succeeded) {
                toast.success('تم حذف القسم بنجاح.');
                const maxPage = Math.ceil((totalItems - 1) / itemsPerPage) || 1;
                if (currentPage > maxPage) setCurrentPage(maxPage);
            } else {
                toast.error(res.errors?.[0]?.message || 'فشل حذف القسم.');
            }
        } catch (error) {
            toast.error(error.response?.data?.errors?.[0]?.message || 'حدث خطأ أثناء الحذف.');
        }
    };

    const handleToggleActivation = async (id) => {
        try {
            const res = await toggleMut.mutateAsync(id);
            if (!res.succeeded) toast.error(res.errors?.[0]?.message || 'فشل تغيير الحالة.');
        } catch (error) {
            toast.error('حدث خطأ.');
        }
    };

    const handleSearch = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };

    return (
      <div className="w-full relative" dir="rtl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-col gap-1.5 text-right w-full md:w-auto">
            <h2 className="text-[26px] md:text-[32px] font-extrabold leading-tight text-[#138C9F]">إدارة الأقسام</h2>
            <p className="text-[14px] md:text-[16px] font-semibold leading-normal text-[#434654]">قم بإضافة وتعديل الأقسام الطبية المتاحة في العيادة</p>
          </div>
          <button onClick={openAddModal} className="flex flex-row items-center justify-center gap-3 w-full md:w-auto h-[48px] md:h-[52px] px-6 py-3 md:py-4 bg-[#138C9F] text-white rounded-lg shadow-sm font-bold text-[15px] hover:bg-[#0f7282] transition-colors shrink-0">
            <span>إضافة قسم جديد</span>
            <Plus className="w-5 h-5 bg-white text-[#138C9F] rounded-full p-0.5 shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[30px] mb-8">
          <div className="flex flex-col items-center justify-center h-[140px] md:h-[160px] bg-white border border-[#138C9F] rounded-xl p-4 md:p-6 shadow-sm">
            <Layers className="w-[26.67px] h-[20.1px] text-[#138C9F] mb-2" />
            <span className="text-[18px] md:text-[20px] font-bold text-[#138C9F] mb-1">أقسام نشطة حالياً</span>
            <span className="text-[22px] md:text-[25px] font-extrabold text-[#138C9F]">{totalActiveDepartments}</span>
          </div>
          <div className="flex flex-col items-center justify-center h-[140px] md:h-[160px] bg-[#138C9F] rounded-xl p-4 md:p-6 shadow-sm">
            <Users className="w-[26.67px] h-[20.1px] text-white mb-2" />
            <span className="text-[18px] md:text-[20px] font-bold text-white mb-1">إجمالي الأطباء في الأقسام</span>
            <span className="text-[22px] md:text-[25px] font-extrabold text-white">{totalDoctors}</span>
          </div>
        </div>

        <div className="mb-4">
          <input type="text" value={searchQuery} onChange={handleSearch} placeholder="بحث عن قسم..."
            className="w-full md:w-[350px] h-[44px] px-4 border border-[#C3C6D6] rounded-xl focus:outline-none focus:border-[#138C9F] font-semibold text-[#0B1C30] placeholder-gray-400 text-right text-sm" />
        </div>

        <div className="bg-white border border-[#C3C6D6] rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-[#e2f4f7] border-b border-[#C3C6D6]">
                  <th className="p-3 md:p-4 text-sm md:text-[18px] font-bold text-[#434654]">اسم القسم</th>
                  <th className="p-3 md:p-4 text-sm md:text-[18px] font-bold text-[#434654] text-center hidden md:table-cell">عدد الأطباء</th>
                  <th className="p-3 md:p-4 text-sm md:text-[18px] font-bold text-[#434654] text-center hidden sm:table-cell">الحالة</th>
                  <th className="p-3 md:p-4 text-sm md:text-[18px] font-bold text-[#434654] text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="4" className="p-8 text-center"><Loader2 className="w-8 h-8 text-[#138C9F] animate-spin mx-auto" /></td></tr>
                ) : departments.length > 0 ? (
                  departments.map((dept) => (
                    <tr key={dept.id} className="border-b border-[#C3C6D6] last:border-0 hover:bg-[#f1f4ff] transition-colors">
                      <td className="p-3 md:p-4 text-sm md:text-[16px] font-bold text-[#0B1C30]">{dept.name}</td>
                      <td className="p-3 md:p-4 text-center hidden md:table-cell">
                        <span className="inline-block bg-[#E5EEFF] text-[#0B1C30] text-[13px] md:text-[14px] font-semibold px-3 md:px-4 py-1 rounded-full">
                          {dept.doctorCount || 0} {(dept.doctorCount || 0) === 1 ? "طبيب" : (dept.doctorCount || 0) >= 2 && (dept.doctorCount || 0) <= 10 ? "أطباء" : "طبيب"}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 text-center hidden sm:table-cell">
                        <span className={`inline-block text-[13px] md:text-[14px] font-bold px-3 md:px-4 py-1 rounded-full ${dept.isActive ? "bg-[rgba(0,79,32,0.1)] text-[#004F20]" : "bg-[rgba(195,198,214,0.3)] text-[#434654]"}`}>
                          {dept.isActive ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => handleToggleActivation(dept.id)} className={`p-2 rounded transition-colors ${dept.isActive ? 'text-[#004F20] hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`} title={dept.isActive ? "تعطيل" : "تفعيل"}>
                            {dept.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          </button>
                          <button onClick={() => openEditModal(dept)} className="p-2 text-[#003D9B] hover:bg-blue-50 rounded transition-colors" title="تعديل">
                            <Edit2 className="w-[18px] h-[18px]" />
                          </button>
                          <button onClick={() => handleDeleteDepartment(dept.id)} className="p-2 text-[#BA1A1A] hover:bg-red-50 rounded transition-colors" title="حذف">
                            <Trash2 className="w-[16px] h-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-bold">لا توجد أقسام مضافة حالياً.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-[#e2f4f7] border-t border-[#C3C6D6] px-4 md:px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="text-[13px] md:text-[14px] text-[#434654] font-semibold">
              عرض {totalItems === 0 ? 0 : indexOfFirstItem + 1} - {Math.min(indexOfFirstItem + itemsPerPage, totalItems)} من إجمالي {totalItems} قسم
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 bg-white border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <button key={pageNumber} onClick={() => setCurrentPage(pageNumber)}
                    className={`w-9 h-9 md:w-10 md:h-10 font-bold rounded flex items-center justify-center text-[15px] md:text-[16px] transition-colors ${currentPage === pageNumber ? "bg-[#138C9F] text-white font-extrabold" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                    {pageNumber}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 bg-white border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white w-full max-w-[calc(100%-2rem)] sm:max-w-[550px] rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-4 sm:p-6 mx-4 relative text-right">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
              <div className="flex items-center justify-start gap-3 mb-6 mt-2">
                <Plus className="w-6 h-6 bg-[#138C9F] text-white rounded-full p-0.5" />
                <div>
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#0B1C30]">{modalMode === "add" ? "إضافة قسم جديد" : "تعديل بيانات القسم"}</h3>
                  <p className="text-[13px] md:text-[14px] text-gray-500 font-medium">قم بإدخال المعلومات الأساسية للقسم لإضافته إلى النظام</p>
                </div>
              </div>
              <form onSubmit={handleSaveDepartment} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-bold text-[#138C9F]">اسم القسم</label>
                  <input type="text" value={deptNameInput} onChange={(e) => setDeptNameInput(e.target.value)} placeholder="مثلاً: جراحة قلب"
                    className="w-full h-[50px] px-4 border border-[#C3C6D6] rounded-xl focus:outline-none focus:border-[#138C9F] font-semibold text-[#0B1C30] placeholder-gray-300 text-right" required />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 h-[46px] border border-[#138C9F] text-[#138C9F] rounded-xl font-bold hover:bg-gray-50 transition-colors w-1/3 text-center">إلغاء</button>
                  <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="px-6 h-[46px] bg-[#138C9F] text-white rounded-xl font-bold hover:bg-[#0f7282] transition-colors flex items-center justify-center gap-2 flex-1 disabled:opacity-50">
                    {(createMut.isPending || updateMut.isPending) && <Loader2 className="w-5 h-5 animate-spin" />}
                    <span>{modalMode === "add" ? "إضافة القسم" : "حفظ التعديلات"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
}
