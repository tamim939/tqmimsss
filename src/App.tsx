/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { 
  School, 
  User, 
  MapPin, 
  Phone, 
  Briefcase, 
  Shirt, 
  Users, 
  Image as ImageIcon,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BATCH_YEARS, GUEST_OPTIONS, RegistrationFormData, T_SHIRT_SIZES } from './types';

export default function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    sscBatch: '',
    fullName: '',
    villageName: '',
    phoneNumber: '',
    occupation: '',
    tShirtSize: '',
    guestCount: '',
    transactionId: '',
    paymentMethod: '',
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const calculateTotal = () => {
    const guestNum = parseInt(formData.guestCount.match(/\d+/)?.[0] || '0');
    const total = 500 + (guestNum * 500);
    return {
      guestNum,
      total,
      text: `Total payable amount 1 alumni + ${guestNum} guest => ${1 + guestNum}*500 = ${total} tk`
    };
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = new FormData();
      
      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'photo' && value !== null && value !== undefined) {
          data.append(key, value.toString());
        }
      });
      
      // Append photo if exists
      if (formData.photo instanceof File) {
        data.append('photo', formData.photo);
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size too large (max 10MB)');
        return;
      }
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateField = (field: keyof RegistrationFormData, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Banner */}
      <div className="w-full h-auto overflow-hidden relative">
        <img 
          src="https://i.ibb.co/TDPYt7yk/x.jpg" 
          alt="School Reunion Banner"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      <main className="max-w-3xl mx-auto px-4 -mt-8 relative z-10">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key={step === 1 ? 'step1' : 'step2'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {step === 1 ? (
                <>
                  {/* Info Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="space-y-4 text-slate-600 leading-relaxed">
                      <p className="font-medium text-slate-800">
                        আনন্দের সাথে জানানো যাচ্ছে যে, আগামী ১২ ডিসেম্বর ২০২৬ তারিখে, ওয়াদুদুর রহমান উচ্চ বিদ্যালয় অ্যালামনাই পরিবার (১৯৬৭-২০২৩)-এর উদ্যোগে বিদ্যালয়ের সকল প্রাক্তন শিক্ষার্থীদের অংশগ্রহণে এক আনন্দঘন পুনর্মিলনী অনুষ্ঠানের আয়োজন হতে যাচ্ছে।
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <div className="flex gap-3 items-start">
                          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                            <AlertCircle size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Registration Deadline</p>
                            <p className="font-semibold text-slate-700">৩০ আগস্ট ২০২৬</p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start">
                          <div className="bg-green-50 p-2 rounded-lg text-green-600">
                            <Users size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Registration Fee</p>
                            <p className="font-semibold text-slate-700">অ্যালামনাই: ৫০০ টাকা | গেস্ট: ৫০০ টাকা</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration Form Step 1 */}
                  <form onSubmit={handleNext} className="space-y-6">
                    <FormSection title="SSC Batch Year" icon={<School className="text-blue-500" />} required>
                      <select 
                        required
                        value={formData.sscBatch}
                        onChange={(e) => updateField('sscBatch', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
                      >
                        <option value="">Choose Batch</option>
                        {BATCH_YEARS.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </FormSection>

                    <FormSection title="Full Name" icon={<User className="text-blue-500" />} required>
                      <input 
                        type="text" 
                        required
                        placeholder="Your answer"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                    </FormSection>

                    <FormSection title="Village Name" icon={<MapPin className="text-blue-500" />} required>
                      <input 
                        type="text" 
                        required
                        placeholder="Your answer"
                        value={formData.villageName}
                        onChange={(e) => updateField('villageName', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                    </FormSection>

                    <FormSection title="Phone Number" icon={<Phone className="text-blue-500" />} required>
                      <input 
                        type="tel" 
                        required
                        placeholder="Your answer"
                        value={formData.phoneNumber}
                        onChange={(e) => updateField('phoneNumber', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                    </FormSection>

                    <FormSection title="Current Occupation" icon={<Briefcase className="text-blue-500" />}>
                      <input 
                        type="text" 
                        placeholder="Your answer"
                        value={formData.occupation}
                        onChange={(e) => updateField('occupation', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                    </FormSection>

                    <FormSection title="Your T-shirt Size" icon={<Shirt className="text-blue-500" />} required>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {T_SHIRT_SIZES.map(size => (
                          <label 
                            key={size}
                            className={`
                              flex items-center justify-center py-3 rounded-xl border-2 cursor-pointer transition-all font-bold
                              ${formData.tShirtSize === size 
                                ? 'bg-blue-50 border-blue-500 text-blue-600' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}
                            `}
                          >
                            <input 
                              type="radio" 
                              name="tshirt" 
                              value={size}
                              required
                              className="hidden"
                              onChange={() => updateField('tShirtSize', size)}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </FormSection>

                    <FormSection title="Passport size image" icon={<ImageIcon className="text-blue-500" />} required>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        required
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                          border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group
                          ${photoPreview ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'}
                        `}
                      >
                        {photoPreview ? (
                          <div className="relative w-32 h-40 rounded-lg overflow-hidden shadow-md">
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-white text-xs font-bold">Change Photo</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="bg-slate-100 p-4 rounded-full text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-all">
                              <ImageIcon size={32} />
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-slate-700">Click or Drag photo here</p>
                              <p className="text-sm text-slate-400">Max 10MB (JPG, PNG)</p>
                            </div>
                          </>
                        )}
                      </div>
                    </FormSection>

                    <FormSection title="Do you plan on bringing any guests?" icon={<Users className="text-blue-500" />} required>
                      <div className="space-y-2">
                        {GUEST_OPTIONS.map(option => (
                          <label 
                            key={option}
                            className={`
                              flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer
                              ${formData.guestCount === option 
                                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                                : 'bg-white border-slate-100 hover:border-slate-200'}
                            `}
                          >
                            <div className={`
                              w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                              ${formData.guestCount === option ? 'border-blue-500' : 'border-slate-300'}
                            `}>
                              {formData.guestCount === option && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                            </div>
                            <input 
                              type="radio" 
                              name="guests" 
                              value={option}
                              required
                              className="hidden"
                              onChange={() => updateField('guestCount', option)}
                            />
                            <span className={`font-medium ${formData.guestCount === option ? 'text-blue-700' : 'text-slate-600'}`}>{option}</span>
                          </label>
                        ))}
                      </div>
                    </FormSection>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
                    >
                      Next Step
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </form>
                </>
              ) : (
                <>
                  {/* Payment Details Step 2 */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold text-slate-800">পেমেন্ট সম্পন্ন করুন</h2>
                      <div className="bg-blue-50 p-4 rounded-xl text-blue-800 font-medium text-sm">
                        {calculateTotal().text}
                      </div>
                      <p className="text-slate-500 text-sm">If any issue about payment, please contact with Saiful Islam (SSC-12) (+8801994573339) via WhatsApp.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`
                        relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3
                        ${formData.paymentMethod.includes('bKash') ? 'border-pink-500 bg-pink-50/50' : 'border-slate-100 hover:border-slate-200'}
                      `}>
                        <input type="radio" name="payment" className="hidden" onChange={() => updateField('paymentMethod', 'bKash - 01708114478')} />
                        <span className="font-bold text-pink-600">bKash (Personal)</span>
                        <p className="text-xl font-mono font-bold text-slate-800">01708-114478</p>
                      </label>
                      
                      <label className={`
                        relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3
                        ${formData.paymentMethod.includes('Bank') ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}
                      `}>
                        <input type="radio" name="payment" className="hidden" onChange={() => updateField('paymentMethod', 'Bank - Trust Bank')} />
                        <span className="font-bold text-blue-600 uppercase">Bank Account</span>
                        <p className="text-[10px] text-center text-slate-600 leading-tight">
                          Md Habibur Rahman<br/>
                          7017-0311282688<br/>
                          Trust Bank, Dilkusha branch
                        </p>
                      </label>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <FormSection title="bKash / Bank Transaction ID" icon={<AlertCircle className="text-blue-500" />} required>
                        <input 
                          type="text" 
                          required
                          placeholder="Enter TxID here"
                          value={formData.transactionId}
                          onChange={(e) => updateField('transactionId', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        />
                      </FormSection>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                        >
                          Back
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          type="submit"
                          className="flex-[2] bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
                        >
                          Complete Registration
                          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-12 text-center space-y-6"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full mb-4">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Registration Successful!</h2>
              <p className="text-lg text-slate-600 max-w-md mx-auto">
                আপনার তথ্য এবং পেমেন্ট ট্রানজেকশন আইডি সফলভাবে জমা হয়েছে। পুনর্মিলনী কমিটির পক্ষ থেকে আপনার সাথে যোগাযোগ করা হবে।
              </p>
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setStep(1);
                  setFormData({
                    sscBatch: '',
                    fullName: '',
                    villageName: '',
                    phoneNumber: '',
                    occupation: '',
                    tShirtSize: '',
                    guestCount: '',
                    transactionId: '',
                    paymentMethod: '',
                    photo: null,
                  });
                  setPhotoPreview(null);
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Submit another response
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>© 2026 Wadudur Rahman High School Reunion Committee</p>
        <p>Helpline: 01994-573339 (WhatsApp)</p>
      </footer>
    </div>
  );
}

function FormSection({ title, children, icon, required }: { title: string, children: React.ReactNode, icon?: React.ReactNode, required?: boolean }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6 transition-all hover:shadow-md hover:border-slate-300">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-bold text-slate-800">
          {title} {required && <span className="text-red-500">*</span>}
        </h3>
      </div>
      {children}
    </div>
  );
}
