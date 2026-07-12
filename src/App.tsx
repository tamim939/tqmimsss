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
      (Object.keys(formData) as Array<keyof RegistrationFormData>).forEach((key) => {
        const value = formData[key];
        if (value && key !== 'photo') {
          data.append(key, value as string);
        }
      });
      
      if (formData.photo) {
        data.append('photo', formData.photo);
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to connect to the server.');
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
    <div className="min-h-screen bg-[#F0F2F2] pb-20">
      {/* Hero Banner */}
      <div className="w-full h-auto overflow-hidden relative">
        <img 
          src="https://i.ibb.co/TDPYt7yk/x.jpg" 
          alt="School Reunion Banner"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      <main className="max-w-3xl mx-auto px-4 -mt-4 relative z-10">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key={step === 1 ? 'step1' : 'step2'}
              initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
              className="space-y-4"
            >
              {step === 1 ? (
                <>
                  {/* Info Card */}
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-4">
                    <h2 className="text-2xl font-normal text-slate-800">Wadudur Rahman High School, Reunion - 2026</h2>
                    <div className="space-y-4 text-slate-600">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold">rsjonayed07@gmail.com</span>
                        <button className="text-blue-600 hover:underline">Switch accounts</button>
                      </div>
                      <p className="text-xs text-slate-500">
                        The name, email address and photo associated with your Google Account will be recorded when you upload files and submit this form
                      </p>
                      <p className="text-red-500 text-sm">* Indicates required question</p>
                    </div>
                  </div>

                  {/* Registration Form Step 1 */}
                  <form onSubmit={handleNext} className="space-y-4">
                    <FormSection title="SSC Batch Year" required>
                      <select 
                        required
                        value={formData.sscBatch}
                        onChange={(e) => updateField('sscBatch', e.target.value)}
                        className="w-full md:w-1/2 bg-white border border-slate-300 rounded-md px-4 py-3 outline-none focus:border-blue-500 transition-all appearance-none"
                      >
                        <option value="">Choose</option>
                        {BATCH_YEARS.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </FormSection>

                    <FormSection title="Full Name" required>
                      <input 
                        type="text" 
                        required
                        placeholder="Your answer"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        className="w-full md:w-3/4 border-b border-slate-300 py-2 outline-none focus:border-blue-500 transition-all"
                      />
                    </FormSection>

                    <FormSection title="Village Name" required>
                      <input 
                        type="text" 
                        required
                        placeholder="Your answer"
                        value={formData.villageName}
                        onChange={(e) => updateField('villageName', e.target.value)}
                        className="w-full md:w-3/4 border-b border-slate-300 py-2 outline-none focus:border-blue-500 transition-all"
                      />
                    </FormSection>

                    <FormSection title="Please provide your current phone number (for urgent communication)" required>
                      <input 
                        type="tel" 
                        required
                        placeholder="Your answer"
                        value={formData.phoneNumber}
                        onChange={(e) => updateField('phoneNumber', e.target.value)}
                        className="w-full md:w-3/4 border-b border-slate-300 py-2 outline-none focus:border-blue-500 transition-all"
                      />
                    </FormSection>

                    <FormSection title="What is your current occupation or Current Position?">
                      <input 
                        type="text" 
                        placeholder="Your answer"
                        value={formData.occupation}
                        onChange={(e) => updateField('occupation', e.target.value)}
                        className="w-full md:w-3/4 border-b border-slate-300 py-2 outline-none focus:border-blue-500 transition-all"
                      />
                    </FormSection>

                    <FormSection title="Your t-shirt size?" required>
                      <div className="space-y-4">
                        {T_SHIRT_SIZES.map(size => (
                          <label key={size} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.tShirtSize === size ? 'border-blue-500' : 'border-slate-300'}`}>
                              {formData.tShirtSize === size && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                            </div>
                            <input 
                              type="radio" 
                              required
                              name="tshirt" 
                              onChange={() => updateField('tShirtSize', size)}
                              className="hidden"
                            />
                            <span className="text-sm text-slate-700">{size}</span>
                          </label>
                        ))}
                      </div>
                    </FormSection>

                    <FormSection title="Passport size image for prospectus" required>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        required
                      />
                      {photoPreview ? (
                        <div className="relative w-32 h-40 rounded border shadow-sm overflow-hidden group">
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/40 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded text-blue-600 text-sm font-medium hover:bg-slate-50 transition-all"
                        >
                          <ImageIcon size={18} />
                          Add File
                        </button>
                      )}
                    </FormSection>

                    <FormSection title="Do you plan on bringing any guests (spouse/children/your car driver/others) to the reunion?" required>
                      <div className="space-y-4">
                        {GUEST_OPTIONS.map(option => (
                          <label key={option} className="flex items-center gap-3 cursor-pointer">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.guestCount === option ? 'border-blue-500' : 'border-slate-300'}`}>
                              {formData.guestCount === option && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                            </div>
                            <input 
                              type="radio" 
                              required
                              name="guests" 
                              onChange={() => updateField('guestCount', option)}
                              className="hidden"
                            />
                            <span className="text-sm text-slate-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </FormSection>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="submit"
                        className="bg-[#667C70] text-white px-8 py-2 rounded-md font-medium text-sm hover:bg-[#55695D] transition-all"
                      >
                        Next
                      </button>
                      <button type="button" className="text-blue-600 text-xs font-medium hover:underline">Clear form</button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  {/* Registration Form Step 2 */}
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-4">
                    <h2 className="text-2xl font-normal text-slate-800">Wadudur Rahman High School, Reunion - 2026</h2>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-slate-700">rsjonayed07@gmail.com</span>
                      <button className="text-blue-600 hover:underline">Switch accounts</button>
                    </div>
                    <p className="text-xs text-slate-500">
                      The name, email address and photo associated with your Google Account will be recorded when you upload files and submit this form
                    </p>
                    <p className="text-red-500 text-sm">* Indicates required question</p>
                  </div>

                  <div className="bg-[#667C70] rounded-lg p-6 text-white font-medium">
                    <p>{calculateTotal().text}</p>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <p className="text-sm text-slate-700">
                      If any issue about payment, please contact with Saiful Islam (SSC-12) (+8801994573339) via WhatsApp.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <FormSection title="bKash/ Nagad Number: (Select the number to which you sent the money)" required>
                      <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.paymentMethod.includes('bKash') ? 'border-blue-500' : 'border-slate-300'}`}>
                            {formData.paymentMethod.includes('bKash') && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                          </div>
                          <input 
                            type="radio" 
                            required
                            name="payment" 
                            onChange={() => updateField('paymentMethod', 'bKash - 01708114478')}
                            className="hidden"
                          />
                          <span className="text-sm text-slate-700">bKash - 01708114478</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.paymentMethod.includes('Bank') ? 'border-blue-500' : 'border-slate-300'}`}>
                            {formData.paymentMethod.includes('Bank') && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                          </div>
                          <input 
                            type="radio" 
                            required
                            name="payment" 
                            onChange={() => updateField('paymentMethod', 'Bank - Acc name: Md Habibur Rahman, Acc no: 7017-0311282688, Trust Bank, Dilkusha Corporate Islamic branch, Routing number: 240271936, Dilkusha CA')}
                            className="hidden"
                          />
                          <span className="text-sm text-slate-700 leading-relaxed">
                            Bank - Acc name: Md Habibur Rahman, Acc no: 7017-0311282688, Trust Bank, Dilkusha Corporate Islamic branch, Routing number: 240271936, Dilkusha CA
                          </span>
                        </label>
                      </div>
                    </FormSection>

                    <FormSection title="bKash / Bank tranaction ID:" required>
                      <input 
                        type="text" 
                        required
                        placeholder="Your answer"
                        value={formData.transactionId}
                        onChange={(e) => updateField('transactionId', e.target.value)}
                        className="w-full md:w-3/4 border-b border-slate-300 py-2 outline-none focus:border-blue-500 transition-all"
                      />
                    </FormSection>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="bg-white border border-slate-300 text-slate-600 px-8 py-2 rounded-md font-medium text-sm hover:bg-slate-50 transition-all"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="bg-[#667C70] text-white px-8 py-2 rounded-md font-medium text-sm hover:bg-[#55695D] transition-all"
                        >
                          Submit
                        </button>
                      </div>
                      <button type="button" className="text-blue-600 text-xs font-medium hover:underline">Clear form</button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center space-y-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-normal text-slate-800">রেজিস্ট্রেশন সাকসেসফুল!</h2>
              <p className="text-slate-600 max-w-md mx-auto">
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
                  });
                  setPhotoPreview(null);
                }}
                className="text-blue-600 font-medium hover:underline"
              >
                Submit another response
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex flex-col items-center gap-4 text-slate-500 text-xs">
          <p className="text-center">Never submit passwords through Google Forms.</p>
          <div className="flex gap-2">
            <button className="hover:underline">Contact form owner</button>
            <span>•</span>
            <button className="hover:underline">Terms of Service</button>
            <span>•</span>
            <button className="hover:underline">Privacy Policy</button>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <span className="text-slate-400 font-medium">Google</span>
            <span className="text-slate-400 text-lg">Forms</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function FormSection({ title, children, required }: { title: string, children: React.ReactNode, required?: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
      <h3 className="text-base font-normal text-slate-900 leading-relaxed">
        {title} {required && <span className="text-red-500">*</span>}
      </h3>
      {children}
    </div>
  );
}
