'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastNotification from '@/components/ToastNotification';
import AuthModal from '@/components/AuthModal';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import { useCartStore } from '@/store/cartStore';
import { useTheme } from '@/hooks/useTheme';
import { useUserStore } from '@/store/userStore';
import { createCodOrder, createRazorpayOrder, verifyRazorpayPayment, reverseGeocodeCoordinates, saveUserProfile } from '@/lib/api';
import LocationPickerModal, { LocationPickerResult } from '@/components/LocationPickerModal';

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const { theme, toggleTheme } = useTheme();
  const [toast, setToast] = useState({ message: '', visible: false });
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);

  const { profile, token, setProfile, isLoggedIn, openAuthModal, closeAuthModal, isAuthModalOpen } = useUserStore();
  const [checkoutAuthOpen, setCheckoutAuthOpen] = useState(false);



  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    locality: profile?.locality || '',
    city: profile?.city || '',
    state: profile?.state || '',
    pincode: profile?.pincode || '',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    selectedBank: 'HDFC Bank',
  });

  // Keep form data in sync if user saved/edited profile in modal
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || profile.firstName || '',
        lastName: prev.lastName || profile.lastName || '',
        email: prev.email || profile.email || '',
        phone: prev.phone || profile.phone || '',
        address: prev.address || profile.address || '',
        locality: prev.locality || profile.locality || '',
        city: prev.city || profile.city || '',
        state: prev.state || profile.state || '',
        pincode: prev.pincode || profile.pincode || '',
      }));
    }
  }, [profile]);

  const {
    items,
    getSubtotal,
    getDiscountAmount,
    couponCode,
    clearCart,
  } = useCartStore();

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const grandTotal = Math.max(0, subtotal - discount);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationConfirmed = (loc: LocationPickerResult) => {
    setFormData((prev) => ({
      ...prev,
      address: loc.address,
      locality: loc.locality || prev.locality,
      city: loc.city || prev.city,
      state: loc.state || prev.state,
      pincode: loc.pincode || prev.pincode,
    }));
    showToast('✓ Residence location pinned and verified from map.');
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    // When logged in, identity fields come from profile; only address fields are in form
    const firstName  = isLoggedIn ? (profile?.firstName ?? '') : formData.firstName;
    const lastName   = isLoggedIn ? (profile?.lastName  ?? '') : formData.lastName;
    const email      = isLoggedIn ? (profile?.email     ?? '') : formData.email;
    const phone      = isLoggedIn ? (profile?.phone     ?? '') : formData.phone;

    if (!firstName || !email || !phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      showToast('Please fill in all required delivery fields.');
      return;
    }

    if (formData.address.trim().length < 5) {
      showToast('Please enter a complete street address (minimum 5 characters).');
      return;
    }

    const cleanPin = formData.pincode.trim();
    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      showToast('Please enter a valid 6-digit Indian PIN code (e.g. 110001).');
      return;
    }

    const cleanCity = formData.city.trim();
    if (cleanCity.length < 2) {
      showToast('Please enter a valid city name.');
      return;
    }

    const cleanState = formData.state.trim();
    if (cleanState.length < 2) {
      showToast('Please enter a valid state.');
      return;
    }

    const profileData = {
      firstName,
      lastName,
      email,
      phone,
      address: formData.address,
      locality: formData.locality,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    };
    // Sync formData so later steps can read name/email/phone
    setFormData(prev => ({ ...prev, firstName, lastName, email, phone }));
    // Save to user store so account icon & future checkouts are updated
    setProfile(profileData);
    // Asynchronously persist / upsert user profile to database
    saveUserProfile(profileData, token).catch((err) => {
      console.warn('Could not persist patron profile to DB:', err);
    });

    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleStep2Next = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    const customerPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      locality: formData.locality,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    };

    const cartPayload = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      size: item.size,
      colorName: item.colorName,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    try {
      if (paymentMethod === 'cod') {
        // Cash On Delivery flow via backend API
        const response = await createCodOrder(cartPayload, customerPayload, couponCode);
        if (response.success && response.orderNumber) {
          setOrderId(response.orderNumber);
          setIsSubmitting(false);
          setIsOrderPlaced(true);
          clearCart();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          showToast(response.message || 'Could not record COD order. Please try again.');
          setIsSubmitting(false);
        }
      } else {
        // Online payment flow (UPI, Cards, NetBanking) via Razorpay
        const rzpReady = await loadRazorpayScript();
        if (!rzpReady) {
          showToast('Payment gateway connection failed. Please check network.');
          setIsSubmitting(false);
          return;
        }

        const orderInit = await createRazorpayOrder(cartPayload, customerPayload, couponCode);
        if (!orderInit.success || !orderInit.razorpayOrderId) {
          showToast(orderInit.message || 'Payment initiation failed.');
          setIsSubmitting(false);
          return;
        }

        const generatedOrderNo = orderInit.orderNumber || `TB-${Math.floor(100000 + Math.random() * 900000)}`;

        // If in test/mock fallback mode
        if (orderInit.isMockGateway) {
          const verifyRes = await verifyRazorpayPayment({
            orderNumber: generatedOrderNo,
            razorpay_order_id: orderInit.razorpayOrderId,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
          });

          if (verifyRes.success) {
            setOrderId(generatedOrderNo);
            setIsSubmitting(false);
            setIsOrderPlaced(true);
            clearCart();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
        }

        // Real Razorpay Checkout modal
        const options = {
          key: orderInit.keyId,
          amount: orderInit.amount,
          currency: 'INR',
          name: 'Thread & Bloom',
          description: `Order ${generatedOrderNo} - Luxury Bedding & Living`,
          image: '/logo.png',
          order_id: orderInit.razorpayOrderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await verifyRazorpayPayment({
                orderNumber: generatedOrderNo,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                setOrderId(generatedOrderNo);
                setIsOrderPlaced(true);
                clearCart();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                showToast(verifyRes.message || 'Payment verification failed.');
              }
            } catch (err: any) {
              showToast('Error verifying transaction.');
            } finally {
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            address: formData.address,
            orderNumber: generatedOrderNo,
          },
          theme: {
            color: '#83533C',
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
              showToast('Transaction was cancelled.');
            },
          },
        };

        const razorpayInstance = new (window as any).Razorpay(options);
        razorpayInstance.on('payment.failed', function (failRes: any) {
          setIsSubmitting(false);
          showToast(`Payment failed: ${failRes.error?.description || 'Please try another method'}`);
        });
        razorpayInstance.open();
      }
    } catch (err: any) {
      console.error('[Checkout Error]:', err);
      showToast('Error processing order. Please try again.');
      setIsSubmitting(false);
    }
  };

  // ── Order Confirmation ────────────────────────────────────────────────────
  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
        <Navbar wishlistCount={0} onOpenCod={() => {}} theme={theme} onToggleTheme={toggleTheme} activePage="discover" />
        <main className="flex-1 w-full max-w-[760px] mx-auto px-4 sm:px-6 pt-36 pb-24 text-center">
          <div className="bg-surface-container border border-outline-variant/50 p-8 sm:p-14 shadow-xl">
            <div className="w-16 h-16 bg-[#2E7D32]/10 text-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#E6C594] font-bold">Order Confirmed</p>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium mt-2 mb-2 text-on-surface">
              Thank You for Your Patronage
            </h1>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto mb-8">
              Your bespoke luxury linen order has been recorded. A confirmation has been sent to{' '}
              <span className="text-on-surface font-medium">{formData.email}</span>.
            </p>

            <div className="bg-surface-container-lowest border border-outline-variant/50 p-5 text-left mb-8 max-w-lg mx-auto text-xs space-y-2.5">
              <div className="flex justify-between border-b border-outline-variant/30 pb-2.5">
                <span className="text-on-surface-variant">Order Reference</span>
                <span className="font-bold text-on-surface select-all">#{orderId}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2.5">
                <span className="text-on-surface-variant">Recipient</span>
                <span className="font-semibold text-on-surface">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2.5">
                <span className="text-on-surface-variant">Delivery Address</span>
                <span className="text-on-surface text-right max-w-[220px] line-clamp-2">{formData.address}, {formData.city} – {formData.pincode}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/30 pb-2.5">
                <span className="text-on-surface-variant">Estimated Arrival</span>
                <span className="font-semibold text-[#2E7D32]">3–5 Business Days</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-on-surface-variant">Amount Paid</span>
                <span className="font-bold text-sm text-on-surface">₹{grandTotal.toLocaleString('en-IN')}.00</span>
              </div>
            </div>

            {/* Track Order Notice */}
            <div className="bg-[#E6C594]/5 border border-[#E6C594]/30 p-4 mb-6 max-w-lg mx-auto">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-xl text-[#E6C594]">local_shipping</span>
                <p className="text-xs font-semibold text-on-surface">Track Your Order</p>
              </div>
              <p className="text-[11px] text-on-surface-variant text-left mb-3">
                Use your order number <span className="font-mono font-bold text-on-surface">#{orderId}</span> and phone number to track your delivery status anytime.
              </p>
              <Link
                href="/track"
                className="w-full bg-[#E6C594] hover:bg-[#d4b07d] text-[#12100E] text-xs font-bold uppercase tracking-[0.2em] px-6 py-2.5 transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">search</span>
                Track Order Now
              </Link>
            </div>

            <p className="text-[10px] text-on-surface-variant mb-6 flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              Your electronic tax invoice is ready for download.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => {
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                  window.open(`${apiUrl}/api/invoice/${orderId}`, '_blank');
                }}
                className="w-full sm:w-auto bg-[#E6C594] text-[#12100E] text-xs font-bold uppercase tracking-[0.2em] px-10 py-3.5 transition-all duration-200 hover:bg-[#d4b07d] inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">download</span>
                Download Tax Invoice (PDF)
              </button>
              <Link href="/blankets" className="bg-on-surface hover:bg-primary text-surface hover:text-on-primary text-xs font-bold uppercase tracking-[0.2em] px-10 py-3.5 transition-all duration-200">
                Continue Shopping
              </Link>
              <Link href="/" className="bg-surface-container hover:bg-surface-container-low text-on-surface text-xs font-bold uppercase tracking-[0.2em] px-10 py-3.5 transition-colors border border-outline-variant/60">
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Stepper Header ────────────────────────────────────────────────────────
  const steps = [
    { num: 1, label: 'Your Details' },
    { num: 2, label: 'Review Order' },
    { num: 3, label: 'Payment' },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans transition-colors duration-200">
      <ToastNotification message={toast.message} visible={toast.visible} />
      <Navbar wishlistCount={0} onOpenCod={() => {}} theme={theme} onToggleTheme={toggleTheme} activePage="discover" />

      <main className="flex-1 w-full max-w-[900px] mx-auto px-4 sm:px-6 pt-32 sm:pt-36 pb-24">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-on-surface-variant">
            <li><Link href="/" className="hover:text-on-surface">Home</Link></li>
            <li>/</li>
            <li><Link href="/cart" className="hover:text-on-surface">Cart</Link></li>
            <li>/</li>
            <li className="text-on-surface font-semibold">Checkout</li>
          </ol>
        </nav>

        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s.num
                    ? 'bg-on-surface text-surface'
                    : step > s.num
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container border-2 border-outline-variant text-on-surface-variant'
                }`}>
                  {step > s.num ? (
                    <span className="material-symbols-outlined text-sm">check</span>
                  ) : s.num}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-semibold ${step === s.num ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-20 sm:w-32 h-px mx-2 mb-5 transition-colors ${step > s.num ? 'bg-primary' : 'bg-outline-variant/50'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Delivery Details ────────────────────────────────────── */}
        {step === 1 && (
          <>
            {/* ── NOT LOGGED IN: Auth Gate ─────────────────────────────────── */}
            {!isLoggedIn ? (
              <div className="space-y-6">
                <h1 className="text-2xl sm:text-3xl font-serif font-medium text-on-surface mb-2">
                  Sign In to Continue
                </h1>
                <p className="text-sm text-on-surface-variant mb-6">
                  Please sign in or create a free account to complete your order.
                </p>

                {/* Auth prompt card */}
                <div className="bg-surface-container border border-[#E6C594]/20 p-8 sm:p-10 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[#E6C594]/10 border border-[#E6C594]/30 flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl text-[#E6C594]">person_outline</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#E6C594] font-bold mb-1">Thread &amp; Bloom</p>
                    <h2 className="text-xl font-serif text-on-surface mb-2">One step away from your luxury order</h2>
                    <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                      Sign in to pre-fill your name, email and phone automatically.
                      You will only need to enter your delivery address.
                    </p>
                  </div>

                  <div className="max-w-sm mx-auto space-y-3.5">
                    <GoogleAuthButton
                      text="Continue with Google"
                      onSuccess={(p) => {
                        showToast(`Welcome, ${p.firstName}! Fill in your shipping address below.`);
                      }}
                      onError={(err) => showToast(err)}
                    />

                    <div className="flex items-center gap-3 text-[#C7B9A5] text-[11px] uppercase tracking-wider">
                      <div className="flex-1 h-px bg-outline-variant/50" />
                      <span>or continue with password</span>
                      <div className="flex-1 h-px bg-outline-variant/50" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        type="button"
                        onClick={() => setCheckoutAuthOpen(true)}
                        className="flex-1 bg-[#E6C594] hover:bg-[#d4b07d] text-[#12100E] font-bold text-xs uppercase tracking-[0.2em] py-3.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">login</span>
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutAuthOpen(true)}
                        className="flex-1 border border-[#E6C594]/40 text-[#E6C594] hover:border-[#E6C594] font-bold text-xs uppercase tracking-[0.2em] py-3.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">person_add</span>
                        Create Account
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-on-surface-variant">
                    Your details are safe and only used for order delivery.
                  </p>
                </div>

                <div className="flex justify-start pt-2">
                  <Link href="/cart" className="text-xs text-on-surface-variant hover:text-on-surface uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-colors">
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to Cart
                  </Link>
                </div>

                {/* Auth modal triggered from checkout */}
                <AuthModal
                  isOpen={checkoutAuthOpen}
                  onClose={() => setCheckoutAuthOpen(false)}
                />
              </div>
            ) : (
              /* ── LOGGED IN: Identity card + Address form only ──────────────── */
              <form onSubmit={handleStep1Next} className="space-y-6">
                <h1 className="text-2xl sm:text-3xl font-serif font-medium text-on-surface mb-6">
                  Delivery Details
                </h1>

                {/* Identity card — locked, shows logged-in user info */}
                <div className="bg-surface-container border border-[#E6C594]/20 p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-outline-variant/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E6C594] text-[#12100E] flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {profile?.firstName ? profile.firstName[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">
                          {profile?.firstName} {profile?.lastName}
                        </p>
                        <p className="text-xs text-on-surface-variant">{profile?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#E6C594] bg-[#E6C594]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Signed In
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-on-surface-variant">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider font-semibold mb-0.5">Mobile</span>
                      <span className="text-on-surface">{profile?.phone || '—'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider font-semibold mb-0.5">Email</span>
                      <span className="text-on-surface truncate block">{profile?.email || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-surface-container border border-outline-variant/70 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-outline-variant/40 flex-wrap gap-2">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
                      Delivery Address
                    </h2>
                    <button
                      type="button"
                      onClick={() => setIsMapPickerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E6C594] hover:bg-[#d4b07d] text-[#12100E] text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                      <span>Locate &amp; Pick on Map</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                        Flat / House No. / Building / Street <span className="text-error">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House / Flat / Street"
                        className="w-full bg-surface-container-lowest border border-outline-variant px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                        Area / Locality
                      </label>
                      <input
                        type="text"
                        name="locality"
                        value={formData.locality}
                        onChange={handleInputChange}
                        placeholder="Area / Locality"
                        className="w-full bg-surface-container-lowest border border-outline-variant px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                        City <span className="text-error">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full bg-surface-container-lowest border border-outline-variant px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                        State <span className="text-error">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="w-full bg-surface-container-lowest border border-outline-variant px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1.5 font-medium">
                        PIN Code <span className="text-error">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="PIN code"
                        maxLength={6}
                        className="w-full bg-surface-container-lowest border border-outline-variant px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link href="/cart" className="text-xs text-on-surface-variant hover:text-on-surface uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-colors">
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    className="bg-on-surface hover:bg-primary text-surface hover:text-on-primary font-bold text-xs uppercase tracking-[0.22em] px-12 py-4 transition-all duration-200 flex items-center gap-2"
                  >
                    Next
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}


        {/* ── STEP 2: Review Order ──────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-on-surface mb-6">
              Review Your Order
            </h1>

            {/* Delivery Summary */}
            <div className="bg-surface-container border border-outline-variant/70 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs space-y-0.5">
                <p className="text-on-surface-variant uppercase tracking-widest text-[10px] font-semibold mb-1">Delivering To</p>
                <p className="font-semibold text-on-surface text-sm">{formData.firstName} {formData.lastName}</p>
                <p className="text-on-surface-variant">{formData.address}{formData.locality ? `, ${formData.locality}` : ''}</p>
                <p className="text-on-surface-variant">{formData.city}, {formData.state} – {formData.pincode}</p>
                <p className="text-on-surface-variant">{formData.phone} · {formData.email}</p>
              </div>
              <button
                onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-[11px] uppercase tracking-widest font-semibold text-on-surface-variant hover:text-on-surface border border-outline-variant/50 px-4 py-2 transition-colors self-start sm:self-center"
              >
                Edit
              </button>
            </div>

            {/* Items */}
            <div className="bg-surface-container border border-outline-variant/70 divide-y divide-outline-variant/30">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-5 items-center">
                  <div className="w-20 h-20 relative bg-surface-container-lowest border border-outline-variant/40 flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-on-surface">{item.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">{item.collection}</p>
                    <p className="text-xs text-on-surface-variant">{item.size} · {item.colorName} · Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-on-surface flex-shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}.00
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-surface-container border border-outline-variant/70 p-5 sm:p-6 space-y-3 text-sm">
              <div className="flex justify-between text-on-surface-variant text-xs">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}.00</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#2E7D32] text-xs">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>–₹{discount.toLocaleString('en-IN')}.00</span>
                </div>
              )}
              <div className="flex justify-between text-on-surface-variant text-xs">
                <span>Shipping</span>
                <span className="text-[#2E7D32] font-semibold">FREE</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-outline-variant/40">
                <span className="font-bold text-on-surface">Grand Total</span>
                <span className="text-xl font-bold text-on-surface">₹{grandTotal.toLocaleString('en-IN')}.00</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-xs text-on-surface-variant hover:text-on-surface uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back
              </button>
              <button
                onClick={handleStep2Next}
                className="bg-on-surface hover:bg-primary text-surface hover:text-on-primary font-bold text-xs uppercase tracking-[0.22em] px-12 py-4 transition-all duration-200 flex items-center gap-2"
              >
                Proceed to Payment
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Payment ───────────────────────────────────────────────── */}
        {step === 3 && (
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-on-surface mb-6">
              Payment
            </h1>

            {/* Order total reminder */}
            <div className="bg-surface-container border border-outline-variant/70 p-4 sm:p-5 flex items-center justify-between text-sm">
              <span className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold">Amount to Pay</span>
              <span className="font-bold text-on-surface text-lg">₹{grandTotal.toLocaleString('en-IN')}.00</span>
            </div>

            {/* Payment Method Tabs */}
            <div className="bg-surface-container border border-outline-variant/70 p-6 sm:p-8">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-5 pb-3 border-b border-outline-variant/40">
                Select Payment Method
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                {(['upi', 'card', 'netbanking', 'cod'] as const).map((method) => {
                  const labels: Record<string, string> = { upi: 'UPI / QR', card: 'Cards', netbanking: 'Net Banking', cod: 'Cash on Delivery' };
                  const icons: Record<string, string> = { upi: 'qr_code_2', card: 'credit_card', netbanking: 'account_balance', cod: 'payments' };
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex flex-col items-center gap-1.5 py-4 px-2 border text-center text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                        paymentMethod === method
                          ? 'border-on-surface bg-on-surface text-surface'
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-on-surface/40'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-xl ${paymentMethod === method ? 'text-surface' : 'text-on-surface-variant'}`}>
                        {icons[method]}
                      </span>
                      {labels[method]}
                    </button>
                  );
                })}
              </div>

              {/* UPI */}
              {paymentMethod === 'upi' && (
                <div className="bg-surface-container-lowest border border-outline-variant p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1">
                    <span className="material-symbols-outlined text-base">info</span>
                    Pay via Google Pay, PhonePe, Paytm or enter your UPI ID below:
                  </div>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    placeholder="yourname@okhdfcbank"
                    className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                  />
                  <div className="flex gap-4 text-[10px] text-on-surface-variant uppercase font-semibold">
                    <span>✓ Zero Transaction Surcharge</span>
                    <span>✓ Instant Refund Guarantee</span>
                  </div>
                </div>
              )}

              {/* Card */}
              {paymentMethod === 'card' && (
                <div className="bg-surface-container-lowest border border-outline-variant p-5 space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1.5">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1.5">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="08 / 29"
                        maxLength={5}
                        className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-on-surface-variant mb-1.5">CVV</label>
                      <input
                        type="password"
                        name="cardCvv"
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        placeholder="• • •"
                        maxLength={4}
                        className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-on-surface transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="bg-surface-container-lowest border border-outline-variant p-5 space-y-3">
                  <label className="block text-xs text-on-surface-variant">Select your bank:</label>
                  <select
                    name="selectedBank"
                    value={formData.selectedBank}
                    onChange={handleInputChange}
                    className="w-full border border-outline-variant px-4 py-3 text-sm text-on-surface outline-none bg-surface-container-lowest focus:border-on-surface transition-colors"
                  >
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                    <option>Yes Bank</option>
                    <option>Punjab National Bank</option>
                    <option>Bank of Baroda</option>
                  </select>
                  <p className="text-[11px] text-on-surface-variant">You will be redirected to your bank&apos;s secure portal.</p>
                </div>
              )}

              {/* COD */}
              {paymentMethod === 'cod' && (
                <div className="bg-surface-container-lowest border border-outline-variant p-5 space-y-2 text-sm">
                  <p className="font-bold text-on-surface">Cash on Delivery Available</p>
                  <p className="text-xs text-on-surface-variant">Pay with cash or UPI QR upon white-glove doorstep delivery. Our delivery executive will assist you.</p>
                  <p className="text-[11px] text-on-surface-variant/70 mt-2">Note: COD orders may take 1 extra business day for confirmation.</p>
                </div>
              )}
            </div>

            {/* Security + Place Order */}
            <div className="bg-surface-container border border-outline-variant/70 p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                <span className="material-symbols-outlined text-base">lock</span>
                <span>256-bit bank-grade encrypted checkout · 100% Satisfaction or 14-Day Exchange</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-on-surface hover:bg-primary text-surface hover:text-on-primary font-bold text-xs uppercase tracking-[0.22em] py-4 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-surface/40 border-t-surface rounded-full animate-spin" />
                    <span>Securely Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>Confirm &amp; Place Order</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center pt-1">
              <button
                type="button"
                onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-xs text-on-surface-variant hover:text-on-surface uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to Order Review
              </button>
            </div>
          </form>
        )}
      </main>

      <LocationPickerModal
        isOpen={isMapPickerOpen}
        onClose={() => setIsMapPickerOpen(false)}
        onConfirm={handleLocationConfirmed}
        initialAddress={formData}
      />

      <Footer />
    </div>
  );
}
