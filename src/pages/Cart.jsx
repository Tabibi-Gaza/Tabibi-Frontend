import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(saved);
  }, []);

  const removeItem = (itemId) => {
    const updated = cartItems.filter(item => item.id !== itemId);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const updateQuantity = (itemId, qty) => {
    const updated = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: Math.max(1, qty) } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-['Cairo'] pt-28 pb-16 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#1e293b] mb-3">السلة</h1>
          <p className="text-gray-500 text-sm md:text-base">المنتجات والخدمات المختارة</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm mb-2">السلة فارغة</p>
            <button
              onClick={() => navigate('/doctors')}
              className="text-[#138C9F] text-sm font-bold hover:underline cursor-pointer"
            >
              تصفح الأطباء ←
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-all">
                  <div className="w-16 h-16 rounded-xl bg-[#138C9F]/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <img loading="lazy" src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#138C9F] text-lg font-bold">{item.name?.[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-[#1e293b] truncate">{item.name}</h3>
                    <p className="text-gray-500 text-xs truncate">{item.description || item.specialty}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity || 1}</span>
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-[#138C9F] text-sm font-bold">{(item.price * (item.quantity || 1))} ₪</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                  >
                    <svg className="w-4 h-4 text-red-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">المجموع الفرعي</span>
                <span className="text-sm font-bold">{totalPrice} ₪</span>
              </div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <span className="text-gray-600 text-sm">رسوم الخدمة</span>
                <span className="text-sm font-bold">0 ₪</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-base font-black text-[#1e293b]">الإجمالي</span>
                <span className="text-lg font-black text-[#138C9F]">{totalPrice} ₪</span>
              </div>
              <button className="w-full bg-[#138C9F] hover:bg-[#0f6c7a] text-white font-bold py-3 rounded-xl transition-all text-sm cursor-pointer">
                إتمام الحجز
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
