'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { saveUserProfile } from '@/lib/api';

import LocationPickerModal, { LocationPickerResult } from './LocationPickerModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function ProfileModal({ isOpen, onClose, onSaved }: ProfileModalProps) {
  const { profile, token, setProfile, logout } = useUserStore();


  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        locality: profile.locality || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
      });
      setIsEditing(false);
    } else {
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        locality: '',
        city: '',
        state: '',
        pincode: '',
      });
      setIsEditing(true);
    }
    setFeedback(null);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationConfirmed = (loc: LocationPickerResult) => {
    setForm((prev) => ({
      ...prev,
      address: loc.address,
      locality: loc.locality || prev.locality,
      city: loc.city || prev.city,
      state: loc.state || prev.state,
      pincode: loc.pincode || prev.pincode,
    }));
    setFeedback('✓ Residence location pinned and updated from interactive map.');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.firstName.trim().length < 2) {
      setFeedback('First name must be at least 2 characters.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setFeedback('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    const cleanPhone = form.phone.trim().replace(/\D/g, '');
    const phone10 = cleanPhone.length === 12 && cleanPhone.startsWith('91') ? cleanPhone.slice(2) : cleanPhone;
    if (!/^[6-9]\d{9}$/.test(phone10)) {
      setFeedback('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    if (form.pincode && !/^[1-9][0-9]{5}$/.test(form.pincode.trim())) {
      setFeedback('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    if (form.address && form.address.trim().length < 5) {
      setFeedback('Please provide a complete street address (minimum 5 characters).');
      return;
    }

    setIsSaving(true);
    setFeedback('Saving your details...');
    try {
      const sanitizedForm = {
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: phone10,
        address: form.address.trim(),
        pincode: form.pincode.trim(),
      };
      const result = await saveUserProfile(sanitizedForm, token);

      if (result.success) {
        setProfile(sanitizedForm);
        setIsEditing(false);
        setFeedback('✓ Details saved to your account successfully!');
        if (onSaved) onSaved();
      } else {
        setFeedback(`Could not save: ${result.message ?? 'Unknown error. Please try again.'}`);
      }
    } catch {
      setFeedback('Network error — please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-outline-variant/60 shadow-2xl flex flex-col text-on-surface">
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-outline-variant/40 flex items-start justify-between bg-surface-container-low">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#E6C594] font-bold block mb-1">
              Thread &amp; Bloom Patron Profile
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-on-surface">
              {profile && !isEditing ? 'Patron Account & Details' : 'Patron Details & Address'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              {profile && !isEditing
                ? 'Your verified delivery details used across checkout and bespoke weaving orders.'
                : 'Enter your personal details and residence address for seamless ordering.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container"
            type="button"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="mx-6 sm:mx-8 mt-4 p-3 bg-surface-container-lowest border border-[#E6C594]/60 text-xs text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#E6C594]">info</span>
            <span>{feedback}</span>
          </div>
        )}

        {/* View Mode (Saved Profile) */}
        {profile && !isEditing ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant/50 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E6C594] text-[#12100E] flex items-center justify-center font-bold text-lg">
                    {profile.firstName ? profile.firstName[0].toUpperCase() : 'P'}
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-medium text-on-surface">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-xs text-on-surface-variant">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { logout(); onClose(); }}
                    className="inline-flex items-center gap-1.5 border border-red-500/40 text-red-400 hover:bg-red-900/20 text-xs uppercase tracking-wider font-semibold px-3 py-2 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Sign Out
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 bg-on-surface hover:bg-primary text-surface hover:text-on-primary text-xs uppercase tracking-wider font-semibold px-4 py-2 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit Details
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <span className="text-on-surface-variant uppercase tracking-wider text-[10px] block mb-0.5 font-semibold">
                    Contact Number
                  </span>
                  <span className="text-on-surface font-medium">{profile.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant uppercase tracking-wider text-[10px] block mb-0.5 font-semibold">
                    Email Address
                  </span>
                  <span className="text-on-surface font-medium">{profile.email || '—'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-on-surface-variant uppercase tracking-wider text-[10px] block mb-0.5 font-semibold">
                    Delivery Address
                  </span>
                  <span className="text-on-surface font-medium block">
                    {profile.address || '—'}
                    {profile.locality ? `, ${profile.locality}` : ''}
                  </span>
                  <span className="text-on-surface-variant block mt-0.5">
                    {profile.city ? `${profile.city}, ` : ''}
                    {profile.state ? `${profile.state} ` : ''}
                    {profile.pincode ? `– ${profile.pincode}` : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-on-surface hover:bg-primary text-surface hover:text-on-primary text-xs uppercase tracking-widest font-bold px-8 py-3 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Edit / Add Mode */
          <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
            {/* Personal Details */}
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-4 pb-2 border-b border-outline-variant/30">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-medium">
                    First Name *
                  </label>
                  <input
                    required
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-medium">
                    Last Name *
                  </label>
                  <input
                    required
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-medium">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-medium">
                    Mobile Number *
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Mobile number"
                    className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Residence & Address Details */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/30 flex-wrap gap-2">
                <h3 className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                  Residence &amp; Address Details
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMapPickerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E6C594] hover:bg-[#d4b07d] text-[#12100E] text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                  <span>Locate &amp; Pick on Map</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-medium">
                    Flat / House No. / Building / Street *
                  </label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House / Flat / Street"
                    className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-medium">
                    Area / Locality
                  </label>
                  <input
                    type="text"
                    name="locality"
                    value={form.locality}
                    onChange={handleChange}
                    placeholder="Area / Locality"
                    className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-medium">
                    City *
                  </label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-medium">
                    State *
                  </label>
                  <input
                    required
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 font-medium">
                    PIN Code *
                  </label>
                  <input
                    required
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="PIN code"
                    maxLength={6}
                    className="w-full bg-surface-container-lowest border border-outline-variant px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
              {profile ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Cancel
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-on-surface hover:bg-primary text-surface hover:text-on-primary font-bold text-xs uppercase tracking-[0.22em] px-8 py-3 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving && (
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                )}
                {isSaving ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </form>
        )}
      </div>

      <LocationPickerModal
        isOpen={isMapPickerOpen}
        onClose={() => setIsMapPickerOpen(false)}
        onConfirm={handleLocationConfirmed}
        initialAddress={form}
      />
    </div>
  );
}
