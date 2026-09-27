import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { 
  UtensilsCrossed, Shirt, Car, Pill, FlaskConical, 
  Factory, Cpu, MoreHorizontal, Sparkles, ChevronLeft, ChevronRight, CheckCircle2
} from 'lucide-react';
import api from '../lib/api';

const SECTORS = [
  { id: 'Food Processing', icon: UtensilsCrossed, title: 'Food Processing', desc: 'Agri-business and food manufacturing' },
  { id: 'Textile', icon: Shirt, title: 'Textile Manufacturing', desc: 'Apparel, fabrics and garments' },
  { id: 'EV/Auto', icon: Car, title: 'EV / Auto Components', desc: 'Automobiles and parts' },
  { id: 'Pharmaceutical', icon: Pill, title: 'Pharmaceutical', desc: 'Drugs and medicines' },
  { id: 'Chemical', icon: FlaskConical, title: 'Chemical', desc: 'Specialty and industrial chemicals' },
  { id: 'Manufacturing', icon: Factory, title: 'General Manufacturing', desc: 'Heavy and light machinery' },
  { id: 'IT/Electronics', icon: Cpu, title: 'IT / Electronics', desc: 'Hardware and electronics' },
  { id: 'Other', icon: MoreHorizontal, title: 'Other', desc: 'Specify your custom sector' },
];

const DISTRICTS = [
  'Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad/Chhatrapati Sambhajinagar', 
  'Thane', 'Kolhapur', 'Solapur', 'Amravati', 'Ratnagiri', 'Satara', 
  'Sangli', 'Nanded', 'Jalgaon', 'Ahmednagar', 'Other'
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateProfile } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    sector: '',
    otherSector: '',
    district: '',
    isMidc: false,
    investment: '',
    employees: '',
    projectName: '',
    projectType: 'New Manufacturing Unit',
    landStatus: 'To be Confirmed',
    envCategory: 'To be Confirmed',
    powerReq: '',
    companyName: '',
    gstin: '',
    contactPhone: ''
  });

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        ...formData,
        sector: formData.sector === 'Other' ? formData.otherSector : formData.sector,
        investment: Number(formData.investment),
        employees: Number(formData.employees)
      };

      await api.post('/auth/complete-onboarding/', payload);
      await updateProfile({ is_onboarded: true });
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = Boolean(formData.sector && (formData.sector !== 'Other' || formData.otherSector));
  const isStep2Valid = Boolean(formData.district && formData.investment && formData.employees);
  const isStep3Valid = Boolean(formData.projectName && formData.companyName && formData.contactPhone);

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative pb-20 overflow-x-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--navy) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="max-w-4xl mx-auto pt-10 px-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[10px] font-bold text-[var(--teal)] uppercase tracking-widest">Setup Wizard</span>
            <h1 className="text-2xl font-bold font-['Playfair_Display']">D.W.A.R Industrial Profile</h1>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--surface-2)] text-[var(--muted)]">
            Step {step} of 4
          </span>
        </div>
        <div className="w-full bg-[var(--line)] h-2 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[var(--teal)]" 
            initial={{ width: '25%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-10 px-6 relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: SECTOR */}
          {step === 1 && (
            <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] mb-2">What kind of business are you setting up?</h2>
                <p className="text-sm text-[var(--muted)]">Select your primary sector to configure relevant Maharashtra regulatory clearances</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {SECTORS.map(s => {
                  const Icon = s.icon;
                  const isSelected = formData.sector === s.id;
                  return (
                    <div 
                      key={s.id} 
                      onClick={() => updateForm('sector', s.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                        ? 'border-[var(--teal)] bg-[var(--teal-soft)] shadow-md' 
                        : 'border-[var(--line)] bg-[var(--surface)] hover:border-[var(--teal)]/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3.5">
                        <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-[var(--teal)] text-white' : 'bg-[var(--surface-2)] text-[var(--navy)]'}`}>
                          <Icon size={22} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-[var(--text)]">{s.title}</h3>
                          <p className="text-xs text-[var(--muted)] mt-0.5">{s.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {formData.sector === 'Other' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="field mt-3">
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">
                    Specify Your Sector
                  </label>
                  <input 
                    type="text" 
                    value={formData.otherSector} 
                    onChange={e => updateForm('otherSector', e.target.value)}
                    placeholder="e.g., Renewable Solar Components"
                    className="w-full px-3.5 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all text-sm font-medium"
                  />
                </motion.div>
              )}

              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleNext} 
                  disabled={!isStep1Valid} 
                  className="button primary flex items-center gap-2 bg-[var(--teal)] text-white px-6 py-2.5 rounded-lg hover:opacity-95 transition-opacity disabled:opacity-40 font-semibold text-sm"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: LOCATION & SCALE */}
          {step === 2 && (
            <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] mb-2">Location & Project Scale</h2>
                <p className="text-sm text-[var(--muted)]">Specify the geographical area and scale in Maharashtra</p>
              </div>

              <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm space-y-6">
                <div className="field">
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">
                    Proposed District in Maharashtra <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    value={formData.district} 
                    onChange={e => updateForm('district', e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface)] text-[var(--text)] focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all text-sm font-medium"
                  >
                    <option value="" disabled>Select a district</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-[var(--line)] rounded-xl bg-[var(--surface-2)]">
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--text)]">MIDC Industrial Area</h4>
                    <p className="text-xs text-[var(--muted)] mt-0.5">Is the unit planned inside a designated MIDC industrial zone?</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData.isMidc} onChange={e => updateForm('isMidc', e.target.checked)} />
                    <div className="w-11 h-6 bg-[var(--line)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--teal)]"></div>
                  </label>
                </div>

                {/* Investment & Employment: Perfectly balanced 1:1 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                  {/* Left Column: Investment */}
                  <div className="field">
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">
                      Proposed Investment (in ₹ Lakhs) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-[var(--muted)] font-bold select-none text-sm">₹</span>
                      <input 
                        type="number" 
                        value={formData.investment} 
                        onChange={e => updateForm('investment', e.target.value)}
                        placeholder="e.g. 50"
                        className="w-full pl-8 pr-20 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] font-medium text-sm focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
                        min="0"
                        step="0.01"
                      />
                      <span className="absolute right-3 px-2 py-0.5 rounded bg-[var(--surface-2)] text-[11px] font-bold text-[var(--muted)] select-none uppercase tracking-wider">
                        Lakhs
                      </span>
                    </div>
                    <div className="min-h-[20px] mt-1.5 flex items-center">
                      {formData.investment ? (
                        <p className="text-xs font-semibold text-[var(--teal)] flex items-center gap-1">
                          <CheckCircle2 size={12} /> Approx: ₹ {(Number(formData.investment) * 100000).toLocaleString('en-IN')}
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--muted)]">e.g. 75 for ₹75 Lakhs (₹0.75 Cr)</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Employment */}
                  <div className="field">
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wide">
                      Expected Employment <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        type="number" 
                        value={formData.employees} 
                        onChange={e => updateForm('employees', e.target.value)}
                        placeholder="e.g. 35"
                        className="w-full pl-3.5 pr-20 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] font-medium text-sm focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
                        min="0"
                      />
                      <span className="absolute right-3 px-2 py-0.5 rounded bg-[var(--surface-2)] text-[11px] font-bold text-[var(--muted)] select-none uppercase tracking-wider">
                        Workers
                      </span>
                    </div>
                    <div className="min-h-[20px] mt-1.5 flex items-center">
                      <p className="text-xs text-[var(--muted)]">Total direct & contractual personnel</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={handleBack} className="button ghost flex items-center gap-2 px-4 py-2 hover:bg-[var(--surface-2)] rounded-lg transition-colors font-semibold text-sm">
                  <ChevronLeft size={18} /> Back
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!isStep2Valid} 
                  className="button primary flex items-center gap-2 bg-[var(--teal)] text-white px-6 py-2.5 rounded-lg hover:opacity-95 transition-opacity disabled:opacity-40 font-semibold text-sm"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PROJECT DETAILS */}
          {step === 3 && (
            <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] mb-2">Operational Project Details</h2>
                <p className="text-sm text-[var(--muted)]">Provide registration, environmental, and infrastructure parameters</p>
              </div>

              <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="field">
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1 uppercase tracking-wide">
                      Company / Enterprise Name <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.companyName} 
                      onChange={e => updateForm('companyName', e.target.value)}
                      placeholder="e.g. Sahyadri Agro Products Pvt Ltd"
                      className="w-full px-3.5 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] font-medium text-sm focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
                    />
                  </div>

                  <div className="field">
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1 uppercase tracking-wide">
                      Project Unit Name <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.projectName} 
                      onChange={e => updateForm('projectName', e.target.value)}
                      placeholder="e.g. Chakan Plant-1"
                      className="w-full px-3.5 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] font-medium text-sm focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
                    />
                  </div>

                  <div className="field">
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1 uppercase tracking-wide">
                      Project Nature / Type
                    </label>
                    <select 
                      value={formData.projectType} 
                      onChange={e => updateForm('projectType', e.target.value)} 
                      className="w-full px-3.5 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface)] text-[var(--text)] font-medium text-sm focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
                    >
                      <option>New Manufacturing Unit</option>
                      <option>Expansion</option>
                      <option>Modernization</option>
                      <option>Diversification</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1 uppercase tracking-wide">
                      Land Readiness Status
                    </label>
                    <select 
                      value={formData.landStatus} 
                      onChange={e => updateForm('landStatus', e.target.value)} 
                      className="w-full px-3.5 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface)] text-[var(--text)] font-medium text-sm focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
                    >
                      <option>To be Confirmed</option>
                      <option>Own Land</option>
                      <option>Leased Land</option>
                      <option>MIDC Allotment</option>
                      <option>To be Acquired</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1 uppercase tracking-wide">
                      MPCB Environmental Category
                    </label>
                    <select 
                      value={formData.envCategory} 
                      onChange={e => updateForm('envCategory', e.target.value)} 
                      className="w-full px-3.5 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface)] text-[var(--text)] font-medium text-sm focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
                    >
                      <option>To be Confirmed</option>
                      <option>Red (High Pollution Index)</option>
                      <option>Orange (Medium Pollution Index)</option>
                      <option>Green (Low Pollution Index)</option>
                      <option>White (Non-Polluting)</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1 uppercase tracking-wide">
                      Power Load Requirement
                    </label>
                    <input 
                      type="text" 
                      value={formData.powerReq} 
                      onChange={e => updateForm('powerReq', e.target.value)}
                      placeholder="e.g. 250 kVA (MSEDCL)"
                      className="w-full px-3.5 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] font-medium text-sm focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
                    />
                  </div>

                  <div className="field">
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1 uppercase tracking-wide">
                      GSTIN (Optional)
                    </label>
                    <input 
                      type="text" 
                      value={formData.gstin} 
                      onChange={e => updateForm('gstin', e.target.value)}
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      className="w-full px-3.5 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] font-medium text-sm focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all font-mono"
                    />
                  </div>

                  <div className="field">
                    <label className="block text-xs font-semibold text-[var(--muted)] mb-1 uppercase tracking-wide">
                      Official Contact Phone <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      value={formData.contactPhone} 
                      onChange={e => updateForm('contactPhone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] font-medium text-sm focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={handleBack} className="button ghost flex items-center gap-2 px-4 py-2 hover:bg-[var(--surface-2)] rounded-lg transition-colors font-semibold text-sm">
                  <ChevronLeft size={18} /> Back
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!isStep3Valid} 
                  className="button primary flex items-center gap-2 bg-[var(--teal)] text-white px-6 py-2.5 rounded-lg hover:opacity-95 transition-opacity disabled:opacity-40 font-semibold text-sm"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {step === 4 && (
            <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] mb-2">Review Your Project Profile</h2>
                <p className="text-sm text-[var(--muted)]">Confirm parameters to generate your personalized Maharashtra approval roadmap</p>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 p-3.5 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-sm">
                <div className="p-4 bg-[var(--surface-2)] border-b border-[var(--line)] flex justify-between items-center">
                  <h3 className="font-semibold text-xs text-[var(--teal)] uppercase tracking-wider">Business & Scale Overview</h3>
                  <button onClick={() => setStep(2)} className="text-[var(--teal)] text-xs font-semibold hover:underline">Edit</button>
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
                  <div>
                    <span className="text-[var(--muted)] block mb-1">Sector</span>
                    <span className="font-semibold text-[var(--text)] text-sm">{formData.sector === 'Other' ? formData.otherSector : formData.sector}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)] block mb-1">District</span>
                    <span className="font-semibold text-[var(--text)] text-sm">{formData.district}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)] block mb-1">MIDC Area</span>
                    <span className="font-semibold text-[var(--text)] text-sm">{formData.isMidc ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)] block mb-1">Investment</span>
                    <span className="font-semibold text-[var(--text)] text-sm">₹ {formData.investment} Lakhs</span>
                    <span className="text-[10px] text-[var(--muted)] block">≈ ₹{(Number(formData.investment) * 100000).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)] block mb-1">Employees</span>
                    <span className="font-semibold text-[var(--text)] text-sm">{formData.employees} Workers</span>
                  </div>
                </div>
                
                <div className="p-4 bg-[var(--surface-2)] border-y border-[var(--line)] flex justify-between items-center">
                  <h3 className="font-semibold text-xs text-[var(--teal)] uppercase tracking-wider">Project & Legal Details</h3>
                  <button onClick={() => setStep(3)} className="text-[var(--teal)] text-xs font-semibold hover:underline">Edit</button>
                </div>
                <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="col-span-2">
                    <span className="text-[var(--muted)] block mb-1">Company Name</span>
                    <span className="font-semibold text-[var(--text)] text-sm">{formData.companyName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[var(--muted)] block mb-1">Project Name</span>
                    <span className="font-semibold text-[var(--text)] text-sm">{formData.projectName}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)] block mb-1">Project Type</span>
                    <span className="font-semibold text-[var(--text)]">{formData.projectType}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)] block mb-1">Land Status</span>
                    <span className="font-semibold text-[var(--text)]">{formData.landStatus}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)] block mb-1">Env Category</span>
                    <span className="font-semibold text-[var(--text)]">{formData.envCategory}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)] block mb-1">Contact Phone</span>
                    <span className="font-semibold text-[var(--text)]">{formData.contactPhone}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                <button onClick={handleBack} className="button ghost flex items-center gap-2 px-4 py-2 hover:bg-[var(--surface-2)] rounded-lg transition-colors font-semibold text-sm">
                  <ChevronLeft size={18} /> Back
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className="button primary px-8 py-3 text-base flex items-center gap-2 bg-[var(--teal)] text-white rounded-xl shadow-lg hover:opacity-95 transition-opacity disabled:opacity-50 font-bold"
                >
                  {loading ? 'Configuring Journey...' : (
                    <>
                      <Sparkles size={18} /> Generate My Approval Roadmap
                    </>
                  )}
                </button>
              </div>
              <p className="text-center text-[11px] text-[var(--muted)] mt-2">
                D.W.A.R will evaluate Maharashtra Industry Rules 2025 and map out sequential clearances and eligible subsidies.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
