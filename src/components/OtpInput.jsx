import React, { useState, useRef, useEffect, useCallback } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";

const OtpInput = ({ length = 6, onComplete, onResend, email }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = useCallback(
    (index, value) => {
      if (!/^\d*$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
        setActiveIndex(index + 1);
      }

      if (newOtp.every((d) => d !== "")) {
        onComplete(newOtp.join(""));
      }
    },
    [otp, length, onComplete]
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace") {
        if (!otp[index] && index > 0) {
          const newOtp = [...otp];
          newOtp[index - 1] = "";
          setOtp(newOtp);
          inputRefs.current[index - 1]?.focus();
          setActiveIndex(index - 1);
        } else {
          const newOtp = [...otp];
          newOtp[index] = "";
          setOtp(newOtp);
        }
      } else if (e.key === "ArrowRight" && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setActiveIndex(index - 1);
      } else if (e.key === "ArrowLeft" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
        setActiveIndex(index + 1);
      }
    },
    [otp, length]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (!pasted) return;
      const newOtp = Array(length).fill("");
      for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
      setOtp(newOtp);
      const nextIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      setActiveIndex(nextIndex);
      if (pasted.length === length) onComplete(pasted);
    },
    [length, onComplete]
  );

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      await onResend();
      setTimer(60);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'فشل إرسال الرمز';
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full" dir="rtl">
      <div className="flex justify-center gap-3 mb-6">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={() => setActiveIndex(i)}
            className={`w-12 h-14 text-center text-xl font-black rounded-xl border-2 transition-all outline-none
              ${
                activeIndex === i
                  ? "border-[#138C9F] bg-[#ecf8fa] text-[#138C9F] shadow-md"
                  : digit
                  ? "border-[#138C9F]/40 bg-white text-[#0B1C30]"
                  : "border-gray-200 bg-gray-50 text-gray-400"
              }`}
          />
        ))}
      </div>

      <div className="text-center">
        {timer > 0 ? (
          <p className="text-sm font-bold text-gray-400">
            إعادة الإرسال خلال{" "}
            <span className="text-[#138C9F] font-black">{formatTime(timer)}</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#138C9F] hover:text-[#0f7585] transition-all cursor-pointer disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
            إعادة إرسال الرمز
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpInput;
