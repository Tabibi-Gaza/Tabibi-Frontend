export const validateName = (name) => /^[\u0600-\u06FFa-zA-Z\s]{2,}$/.test(name);
export const validatePhone = (phone) => /^05[96]\d{8}$/.test(phone);
export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
