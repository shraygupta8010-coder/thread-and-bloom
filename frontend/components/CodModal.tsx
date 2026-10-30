'use client';

import { useState } from 'react';

interface CodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function CodModal({ isOpen, onClose, onSubmit }: CodModalProps) {
  const [form, setForm] = useState({ name: '', phone: '', pincode: '', address: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
    setForm({ name: '', phone: '', pincode: '', address: '' });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-surface-container-low p-6 flex items-start justify-between border-b border-outline-variant/30">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-1">
              Instant Concierge Checkout
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Cash On Delivery Order</h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Pay only when you inspect the bedding suite at your doorstep.
            </p>
          </div>
          <button
            aria-label="Close modal"
            className="p-1 text-on-surface-variant hover:text-on-surface"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block font-label-sm text-xs uppercase tracking-wider text-on-surface mb-1.5">
              Full Recipient Name *
            </label>
            <input
              className="w-full bg-surface-container-low px-4 py-3 rounded-lg text-sm font-body-md text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="e.g. Radhika Sundaram"
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Phone + PIN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-xs uppercase tracking-wider text-on-surface mb-1.5">
                WhatsApp Mobile No. *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg bg-surface-container font-label-sm text-xs text-on-surface font-semibold border-r border-outline-variant/30">
                  +91
                </span>
                <input
                  className="w-full bg-surface-container-low px-4 py-3 rounded-r-lg text-sm font-body-md text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary transition-all"
                  pattern="[0-9]{10}"
                  placeholder="98200 12345"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-xs uppercase tracking-wider text-on-surface mb-1.5">
                PIN Code *
              </label>
              <input
                className="w-full bg-surface-container-low px-4 py-3 rounded-lg text-sm font-body-md text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary transition-all"
                pattern="[0-9]{6}"
                placeholder="e.g. 110001"
                required
                type="text"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block font-label-sm text-xs uppercase tracking-wider text-on-surface mb-1.5">
              Delivery Address &amp; Landmark *
            </label>
            <textarea
              className="w-full bg-surface-container-low px-4 py-3 rounded-lg text-sm font-body-md text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="Apartment / Villa, Street, Landmark details..."
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <button
            className="w-full py-4 bg-on-background text-on-primary rounded-lg font-label-md text-xs uppercase tracking-widest hover:bg-primary transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            type="submit"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            <span>Confirm Cash On Delivery Order</span>
          </button>
        </form>
      </div>
    </div>
  );
}
