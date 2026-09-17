import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../api/axiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faFileImage, faSpinner, faUniversity, faWallet, faArrowRight, faCircleCheck, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

const PaymentPage = () => {
  const { t } = useTranslation()
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  if (!location.state?.doctorId) {
    return <Navigate to="/doctors" replace />;
  }

  const { doctorId, amount, dateTime, doctorName } = location.state || {}

  const [paymentMethods, setPaymentMethods] = useState([])
  const [loadingMethods, setLoadingMethods] = useState(true)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [receiptFile, setReceiptFile] = useState(null)
  const [receiptPreview, setReceiptPreview] = useState(null)
  const [senderName, setSenderName] = useState('')
  const [senderPhone, setSenderPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!doctorId) return
    const fetchPaymentMethods = async () => {
      setLoadingMethods(true)
      try {
        const { data } = await axiosInstance.get(`/patient/doctors/${doctorId}/payment-methods`)
        if (data.succeeded && data.data) {
          setPaymentMethods(data.data)
        } else {
          setPaymentMethods([])
        }
      } catch (err) {

        setPaymentMethods(null)
      } finally {
        setLoadingMethods(false)
      }
    }
    fetchPaymentMethods()
  }, [doctorId])

  const handleFileSelect = useCallback((file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error(t('payment.selectImageOnly'))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('payment.maxFileSize'))
      return
    }
    setReceiptFile(file)
    setReceiptPreview(URL.createObjectURL(file))
  }, [])

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleSubmit = async () => {
    if (!selectedMethod) {
      toast.warn(t('payment.selectMethodFirst'))
      return
    }
    if (!receiptFile) {
      toast.warn(t('payment.uploadReceiptFirst'))
      return
    }
    if (!senderName.trim()) {
      toast.warn(t('payment.enterSenderName'))
      return
    }
    if (!senderPhone.trim()) {
      toast.warn(t('payment.enterSenderPhone'))
      return
    }

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('AppointmentId', appointmentId)
      fd.append('File', receiptFile)
      fd.append('SenderAccountHolderName', senderName.trim())
      fd.append('SenderPhoneNumber', senderPhone.trim())
      fd.append('PaymentMethodType', selectedMethod.type)
      fd.append('PaymentMethodId', selectedMethod.id)

      const { data } = await axiosInstance.post('/patient/appointments/submit-receipt', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (data.succeeded) {
        toast.success(data.message || t('payment.uploadSuccess'))
        setTimeout(() => navigate('/my-appointment'), 2000)
      } else {
        toast.error(data.errors?.[0]?.message || data.message || t('payment.uploadFailed'))
      }
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0]?.message || error.response?.data?.message || t('payment.uploadError'))
    } finally {
      setSubmitting(false)
    }
  }

  const formatDateTime = (dt) => {
    if (!dt) return ''
    try {
      const date = new Date(dt)
      if (isNaN(date.getTime())) return dt
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${day}/${month}/${year} ${hours}:${minutes}`
    } catch {
      return dt
    }
  }

  const allMethods = Array.isArray(paymentMethods) ? paymentMethods : []
  const banks = allMethods.filter(m => m.type === 'Bank')
  const wallets = allMethods.filter(m => m.type === 'Wallet')

  return (
    <div className="w-full p-4 pt-40 max-w-4xl mx-auto text-right mb-16" dir="rtl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-[#138C9F] mb-6 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowRight} />
        <span>{t('payment.back')}</span>
      </button>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">{t('payment.confirmPayment')}</h1>
        <p className="text-sm text-gray-500">{t('payment.selectPaymentMethod')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 border-r-4 border-[#138C9F] pr-2">
              {t('payment.appointmentDetails')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{t('payment.doctor')}</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{doctorName || '—'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{t('payment.dateTime')}</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{formatDateTime(dateTime)}</p>
              </div>
            </div>
          </div>

          {/* Payment Methods - Selectable */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 border-r-4 border-[#138C9F] pr-2">
              {t('payment.selectPaymentAccount')}
            </h3>

            {loadingMethods ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#138C9F]"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {banks.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2">
                      <FontAwesomeIcon icon={faUniversity} className="text-[#138C9F]" />
                      {t('payment.bankAccounts')}
                    </p>
                    {banks.map((bank, idx) => {
                      const isSelected = selectedMethod?.id === bank.id && selectedMethod?.type === 'Bank'
                      return (
                        <div
                          key={bank.id || idx}
                          onClick={() => setSelectedMethod({ id: bank.id, type: 'Bank', name: bank.name, accountHolderName: bank.accountHolderName })}
                          className={`rounded-xl p-4 mb-3 border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#138C9F] bg-[#e6f6f5] dark:bg-gray-800 shadow-sm'
                              : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-[#138C9F] bg-[#e6f6f5] dark:bg-gray-800 px-2 py-0.5 rounded-md">{bank.name}</span>
                            {isSelected && (
                              <FontAwesomeIcon icon={faCircleCheck} className="text-[#138C9F] text-lg" />
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-xs text-gray-400">{t('payment.accountName')}</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300">{bank.accountHolderName}</p>
                            </div>
                            {bank.iban && (
                              <div>
                                <p className="text-xs text-gray-400">{t('payment.iban')}</p>
                                <p className="font-medium text-gray-700 dark:text-gray-300" dir="ltr">{bank.iban}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-gray-400">{t('payment.phoneNumber')}</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300" dir="ltr">{bank.phoneNumber}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {wallets.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-2">
                      <FontAwesomeIcon icon={faWallet} className="text-[#138C9F]" />
                      {t('payment.eWallets')}
                    </p>
                    {wallets.map((wallet, idx) => {
                      const isSelected = selectedMethod?.id === wallet.id && selectedMethod?.type === 'Wallet'
                      return (
                        <div
                          key={wallet.id || idx}
                          onClick={() => setSelectedMethod({ id: wallet.id, type: 'Wallet', name: wallet.name, accountHolderName: wallet.accountHolderName })}
                          className={`rounded-xl p-4 mb-3 border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#138C9F] bg-[#e6f6f5] dark:bg-gray-800 shadow-sm'
                              : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-[#138C9F] bg-[#e6f6f5] dark:bg-gray-800 px-2 py-0.5 rounded-md">{wallet.name}</span>
                            {isSelected && (
                              <FontAwesomeIcon icon={faCircleCheck} className="text-[#138C9F] text-lg" />
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-xs text-gray-400">{t('payment.name')}</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300">{wallet.accountHolderName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">{t('payment.phoneNumber')}</p>
                              <p className="font-medium text-gray-700 dark:text-gray-300" dir="ltr">{wallet.phoneNumber}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {banks.length === 0 && wallets.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    <p className="text-sm">{t('payment.noPaymentMethods')}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Receipt Upload - Only show after selecting a method */}
          {selectedMethod && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 border-r-4 border-[#138C9F] pr-2">
                {t('payment.uploadReceipt')}
              </h3>

              <div className="bg-[#e6f6f5] dark:bg-gray-800 rounded-xl p-3 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faInfoCircle} className="text-[#138C9F] text-sm" />
                <p className="text-xs text-[#0c5f6c] dark:text-gray-300 font-medium">
                  {t('payment.transferInstruction')} <span className="font-bold">{selectedMethod.name}</span> ({selectedMethod.accountHolderName}) {t('payment.thenUpload')}
                </p>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('receipt-input').click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-[#138C9F] bg-[#e6f6f5] dark:bg-gray-800'
                    : receiptPreview
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#138C9F] hover:bg-gray-50 dark:bg-gray-900'
                }`}
              >
                <input
                  id="receipt-input"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />

                {receiptPreview ? (
                  <div className="space-y-3">
                    <img
                      loading="lazy"
                      decoding="async"
                      width="384"
                      height="192"
                      src={receiptPreview}
                      alt={t('payment.receiptImage')}
                      className="max-h-48 mx-auto rounded-lg object-contain shadow-sm"
                    />
                    <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faFileImage} />
                      {t('payment.fileSelected')}
                    </p>
                    <p className="text-xs text-gray-400">{t('payment.clickToChange')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                      <FontAwesomeIcon icon={faUpload} className="text-2xl text-gray-400" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-gray-600 dark:text-gray-400">{t('payment.dragOrClick')}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('payment.fileFormats')}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-2">{t('payment.senderName')}</label>
                  <input
                    type="text"
                    placeholder={t('payment.senderNamePlaceholder')}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#138C9F] text-sm bg-white dark:bg-gray-700 dark:text-white"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{t('payment.senderPhone')}</label>
                  <input
                    type="tel"
                    placeholder={t('payment.senderPhonePlaceholder')}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#138C9F] text-sm bg-white dark:bg-gray-700 dark:text-white"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !receiptFile}
                  className={`px-8 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 flex items-center gap-2 ${
                    !submitting && receiptFile
                      ? 'bg-[#138C9F] hover:bg-[#008f84] cursor-pointer shadow-sm'
                      : 'bg-[#c3cacf] cursor-not-allowed'
                  }`}
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      <span>{t('payment.uploading')}</span>
                    </>
                  ) : (
                    <span>{t('payment.submitPayment')}</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm sticky top-44">
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 border-r-4 border-[#138C9F] pr-2">
              {t('payment.paymentSummary')}
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">{t('payment.doctorLabel')}</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{doctorName || '—'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">{t('payment.appointmentLabel')}</span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{formatDateTime(dateTime)}</span>
              </div>
              {selectedMethod && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{t('payment.paymentAccount')}</span>
                  <span className="text-xs font-medium text-[#138C9F]">{selectedMethod.name}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('payment.amountDue')}</span>
                <span className="text-xl font-extrabold text-[#138C9F]">{amount || '—'} <span className="text-sm">ILS</span></span>
              </div>
            </div>

            <div className="mt-6 bg-[#f4faff] dark:bg-gray-800 rounded-xl p-4 border border-[#e6f6f5]">
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 leading-relaxed">
                <span className="font-bold text-[#138C9F]">{t('payment.note')}</span> {t('payment.noteDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
