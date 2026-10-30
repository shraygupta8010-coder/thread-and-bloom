'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import {
  signupApi,
  loginApi,
  forgotPasswordApi,
  resetPasswordApi,
  UserProfilePayload,
} from '@/lib/api';
import GoogleAuthButton from './GoogleAuthButton';

type AuthView = 'login' | 'signup' | 'forgot' | 'verify' | 'complete-profile';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

// ── Reusable Field ─────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  maxLength?: number;
  suffix?: React.ReactNode;
}

function Field({ label, name, type = 'text', value, onChange, placeholder, required, hint, maxLength, suffix }: FieldProps) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-[#C7B9A5] mb-1 font-medium">
        {label}{required && ' *'}
      </label>
      <div className="relative">
        <input
          required={required}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={name === 'password' || name === 'confirmPassword' || name === 'newPassword' ? 'current-password' : name === 'email' ? 'email' : 'off'}
          className="w-full bg-[#0F0D0B] border border-[#3A3125] px-3.5 py-2.5 text-xs text-[#FAF6F0] placeholder:text-[#C7B9A5]/40 outline-none focus:border-[#E6C594]/60 transition-colors pr-10"
        />
        {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
      {hint && <p className="text-[10px] text-[#C7B9A5]/70 mt-0.5">{hint}</p>}
    </div>
  );
}

// ── Password field with show/hide ──────────────────────────────────────────────
function PasswordField({ label, name, value, onChange, placeholder, required }: Omit<FieldProps, 'type' | 'suffix'>) {
  const [show, setShow] = useState(false);
  return (
    <Field
      label={label} name={name} type={show ? 'text' : 'password'}
      value={value} onChange={onChange} placeholder={placeholder} required={required}
      suffix={
        <button type="button" onClick={() => setShow(s => !s)}
          className="text-[#C7B9A5] hover:text-[#E6C594] transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}>
          <span className="material-symbols-outlined text-[18px]">{show ? 'visibility_off' : 'visibility'}</span>
        </button>
      }
    />
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function PrimaryBtn({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full inline-flex items-center justify-center gap-2 bg-[#E6C594] hover:bg-[#d4b07d] text-[#12100E] font-bold text-xs uppercase tracking-[0.2em] py-3 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
      {loading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
      {children}
    </button>
  );
}

function Feedback({ msg, isError }: { msg: string; isError?: boolean }) {
  return (
    <div className={`p-3 border text-xs flex items-start gap-2 ${isError ? 'bg-red-900/20 border-red-500/40 text-red-300' : 'bg-[#1A1612] border-[#E6C594]/40 text-[#FAF6F0]'}`}>
      <span className={`material-symbols-outlined text-base flex-shrink-0 ${isError ? 'text-red-400' : 'text-[#E6C594]'}`}>
        {isError ? 'error' : 'info'}
      </span>
      <span>{msg}</span>
    </div>
  );
}

function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-[#C7B9A5] text-[11px] uppercase tracking-wider">
      <div className="flex-1 h-px bg-[#3A3125]/60" />{text}<div className="flex-1 h-px bg-[#3A3125]/60" />
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const { login } = useUserStore();
  const [view, setView] = useState<AuthView>('login');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; isError: boolean } | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [otpIdentifier, setOtpIdentifier] = useState('');

  const [f, setF] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', identifier: '',
    otp: '', newPassword: '', confirmNewPassword: '',
    googleEmail: '', googleFirstName: '', googleLastName: '', googleToken: '',
    address: '', locality: '', city: '', state: '', pincode: '',
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const reset = () => {
    setF({ 
      firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', identifier: '', 
      otp: '', newPassword: '', confirmNewPassword: '',
      googleEmail: '', googleFirstName: '', googleLastName: '', googleToken: '',
      address: '', locality: '', city: '', state: '', pincode: '',
    });
    setFeedback(null);
    setWhatsappUrl(null);
    setOtpIdentifier('');
  };

  const switchView = (v: AuthView) => { reset(); setView(v); };

  if (!isOpen) return null;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = f.identifier.trim();
    if (!id || !f.password) {
      setFeedback({ msg: 'Please enter your registered mobile / email and password.', isError: true });
      return;
    }

    if (id.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(id)) {
        setFeedback({ msg: 'Please enter a valid email address.', isError: true });
        return;
      }
    } else {
      const cleanDigits = id.replace(/\D/g, '');
      if (cleanDigits.length < 10) {
        setFeedback({ msg: 'Please enter a valid 10-digit mobile number.', isError: true });
        return;
      }
    }

    setLoading(true); setFeedback(null);
    try {
      const res = await loginApi(id, f.password);
      if (res.success && res.profile) {
        const p = res.profile as UserProfilePayload & { address?: string; locality?: string; city?: string; state?: string; pincode?: string };
        login({
          firstName: p.firstName ?? '',
          lastName: p.lastName ?? '',
          email: p.email ?? '',
          phone: p.phone ?? '',
          address: p.address ?? '',
          locality: p.locality ?? '',
          city: p.city ?? '',
          state: p.state ?? '',
          pincode: p.pincode ?? '',
        }, res.token);
        setFeedback({ msg: `Welcome back, ${p.firstName}! You are now signed in.`, isError: false });
        setTimeout(() => { onClose(); reset(); onLoginSuccess?.(); }, 1200);

      } else {
        setFeedback({ msg: res.message ?? 'Invalid credentials. Please try again.', isError: true });
      }
    } catch {
      setFeedback({ msg: 'Network error — please check your connection.', isError: true });
    } finally { setLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFirstName = f.firstName.trim();
    if (cleanFirstName.length < 2) {
      setFeedback({ msg: 'First name must be at least 2 characters.', isError: true });
      return;
    }

    const cleanEmail = f.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setFeedback({ msg: 'Please enter a valid email address (e.g. name@example.com).', isError: true });
      return;
    }

    const cleanDigits = f.phone.trim().replace(/\D/g, '');
    const phone10 = cleanDigits.length === 12 && cleanDigits.startsWith('91') ? cleanDigits.slice(2) : cleanDigits;
    if (!/^[6-9]\d{9}$/.test(phone10)) {
      setFeedback({ msg: 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).', isError: true });
      return;
    }

    if (f.password.length < 6) {
      setFeedback({ msg: 'Password must be at least 6 characters long.', isError: true });
      return;
    }

    if (!/[a-zA-Z]/.test(f.password) || !/\d/.test(f.password)) {
      setFeedback({ msg: 'Password must contain both letters and numbers.', isError: true });
      return;
    }

    if (f.password !== f.confirmPassword) {
      setFeedback({ msg: 'Passwords do not match. Please re-enter.', isError: true });
      return;
    }

    setLoading(true); setFeedback(null);
    try {
      const res = await signupApi({
        firstName: cleanFirstName,
        lastName: f.lastName.trim(),
        email: cleanEmail,
        phone: phone10,
        password: f.password,
      });

      if (res.success) {
        // Auto-login immediately after signup — no need to redirect to login
        login({
          firstName: cleanFirstName,
          lastName: f.lastName.trim(),
          email: cleanEmail,
          phone: phone10,
          address: '',
          locality: '',
          city: '',
          state: '',
          pincode: '',
        }, res.token);
        setFeedback({ msg: `Welcome, ${cleanFirstName}! Your account has been created and you are now signed in.`, isError: false });
        setTimeout(() => { onClose(); reset(); onLoginSuccess?.(); }, 1400);

      } else {
        setFeedback({ msg: res.message ?? 'Signup failed. Please try again.', isError: true });
      }
    } catch {
      setFeedback({ msg: 'Network error — please check your connection.', isError: true });
    } finally { setLoading(false); }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = f.identifier.trim();
    if (!id) {
      setFeedback({ msg: 'Please enter your registered email or WhatsApp number.', isError: true });
      return;
    }

    if (id.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(id)) {
        setFeedback({ msg: 'Please enter a valid email address.', isError: true });
        return;
      }
    } else {
      const digits = id.replace(/\D/g, '');
      if (digits.length < 10) {
        setFeedback({ msg: 'Please enter a valid 10-digit mobile number.', isError: true });
        return;
      }
    }

    setLoading(true); setFeedback(null);
    try {
      const res = await forgotPasswordApi(id);
      if (res.success) {
        setOtpIdentifier(id);
        setWhatsappUrl(res.whatsappUrl ?? null);
        if (res.code) setF(prev => ({ ...prev, otp: res.code! }));
        setFeedback({ msg: 'OTP generated! Tap the WhatsApp button to receive your code, then enter it to reset your password.', isError: false });
      } else {
        setFeedback({ msg: res.message ?? 'Account not found. Please check your email / phone.', isError: true });
      }
    } catch {
      setFeedback({ msg: 'Network error — please check your connection.', isError: true });
    } finally { setLoading(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = f.otp.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      setFeedback({ msg: 'Verification code must be exactly 6 digits.', isError: true });
      return;
    }

    if (f.newPassword.length < 6) {
      setFeedback({ msg: 'New password must be at least 6 characters long.', isError: true });
      return;
    }

    if (!/[a-zA-Z]/.test(f.newPassword) || !/\d/.test(f.newPassword)) {
      setFeedback({ msg: 'New password must contain both letters and numbers.', isError: true });
      return;
    }

    if (f.newPassword !== f.confirmNewPassword) {
      setFeedback({ msg: 'Passwords do not match. Please re-enter.', isError: true });
      return;
    }

    setLoading(true); setFeedback(null);
    try {
      const res = await resetPasswordApi({ identifier: otpIdentifier, code: cleanOtp, newPassword: f.newPassword });
      if (res.success) {
        setFeedback({ msg: 'Password reset successful! You are now using your new password.', isError: false });
        setTimeout(() => switchView('login'), 1500);
      } else {
        setFeedback({ msg: res.message ?? 'Invalid or expired OTP. Please try again.', isError: true });
      }
    } catch {
      setFeedback({ msg: 'Network error — please check your connection.', isError: true });
    } finally { setLoading(false); }
  };


  // ── View metadata ──────────────────────────────────────────────────────────
  const titles: Record<AuthView, { title: string; subtitle: string }> = {
    login:  { title: 'Welcome Back',    subtitle: 'Sign in to your Thread & Bloom patron account.' },
    signup: { title: 'Create Account',  subtitle: 'Join Thread & Bloom for a bespoke luxury experience.' },
    forgot: { title: 'Forgot Password', subtitle: 'We will send a verification code to your WhatsApp.' },
    verify: { title: 'Reset Password',  subtitle: 'Enter the 6-digit OTP and choose a new password.' },
    'complete-profile': { title: 'Complete Your Profile', subtitle: 'Help us personalize your experience with a few details.' },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#12100E] w-full max-w-md border border-[#E6C594]/20 shadow-2xl flex flex-col max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="p-6 border-b border-[#E6C594]/15 flex items-start justify-between bg-[#0F0D0B]">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#E6C594] font-bold block mb-1">Thread &amp; Bloom</span>
            <h2 className="text-xl font-serif font-medium text-[#FAF6F0]">{titles[view].title}</h2>
            <p className="text-xs text-[#C7B9A5] mt-1">{titles[view].subtitle}</p>
          </div>
          <button onClick={onClose} type="button" aria-label="Close"
            className="p-1.5 text-[#C7B9A5] hover:text-[#FAF6F0] transition-colors rounded-full hover:bg-[#1F1C19]">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {feedback && <Feedback msg={feedback.msg} isError={feedback.isError} />}

          {/* ── LOGIN ── */}
          {view === 'login' && (
            <div className="space-y-4">
              <GoogleAuthButton
                text="Continue with Google"
                onSuccess={(p, isNewUser, token) => {
                  if (isNewUser) {
                    // New user - show profile completion form
                    setF(prev => ({ ...prev, googleEmail: p.email, googleFirstName: p.firstName, googleLastName: p.lastName || '', googleToken: token || '' }));
                    setView('complete-profile');
                    setFeedback({ msg: `Welcome, ${p.firstName}! Please complete your profile to continue.`, isError: false });
                  } else {
                    // Existing user - login directly
                    setFeedback({ msg: `Welcome back, ${p.firstName}! Signed in with Google.`, isError: false });
                    setTimeout(() => { onClose(); reset(); onLoginSuccess?.(); }, 1200);
                  }
                }}
                onError={(err) => setFeedback({ msg: err, isError: true })}
              />
              <Divider text="or sign in with password" />
              <form onSubmit={handleLogin} className="space-y-4">
                <Field label="Email or Phone Number" name="identifier" value={f.identifier} onChange={handle}
                  placeholder="email@example.com or 9876543210" required />
                <PasswordField label="Password" name="password" value={f.password} onChange={handle}
                  placeholder="Your password" required />
                <div className="text-right -mt-1">
                  <button type="button" onClick={() => switchView('forgot')}
                    className="text-[11px] text-[#E6C594] hover:underline uppercase tracking-wider">
                    Forgot Password?
                  </button>
                </div>
                <PrimaryBtn loading={loading}>Sign In</PrimaryBtn>
                <Divider text="or" />
                <p className="text-center text-xs text-[#C7B9A5]">
                  New to Thread &amp; Bloom?{' '}
                  <button type="button" onClick={() => switchView('signup')}
                    className="text-[#E6C594] hover:underline font-semibold">
                    Create Account
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* ── SIGNUP ── */}
          {view === 'signup' && (
            <div className="space-y-4">
              <GoogleAuthButton
                text="Sign up with Google"
                onSuccess={(p, isNewUser, token) => {
                  if (isNewUser) {
                    // New user - show profile completion form
                    setF(prev => ({ ...prev, googleEmail: p.email, googleFirstName: p.firstName, googleLastName: p.lastName || '', googleToken: token || '' }));
                    setView('complete-profile');
                    setFeedback({ msg: `Welcome, ${p.firstName}! Please complete your profile to continue.`, isError: false });
                  } else {
                    // Existing user - login directly
                    setFeedback({ msg: `Welcome to Thread & Bloom, ${p.firstName}! Account created with Google.`, isError: false });
                    setTimeout(() => { onClose(); reset(); onLoginSuccess?.(); }, 1200);
                  }
                }}
                onError={(err) => setFeedback({ msg: err, isError: true })}
              />
              <Divider text="or register with email" />
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name" name="firstName" value={f.firstName} onChange={handle} placeholder="First name" required />
                  <Field label="Last Name" name="lastName" value={f.lastName} onChange={handle} placeholder="Last name" />
                </div>
                <Field label="Email Address" name="email" type="email" value={f.email} onChange={handle}
                  placeholder="email@example.com" required />
                <Field label="WhatsApp / Mobile" name="phone" type="tel" value={f.phone} onChange={handle}
                  placeholder="10-digit mobile number" required
                  hint="Used to receive OTP for password reset via WhatsApp" />
                <PasswordField label="Password" name="password" value={f.password} onChange={handle}
                  placeholder="Min. 6 characters" required />
                <PasswordField label="Confirm Password" name="confirmPassword" value={f.confirmPassword} onChange={handle}
                  placeholder="Repeat your password" required />
                <PrimaryBtn loading={loading}>Create Account</PrimaryBtn>
                <Divider text="or" />
                <p className="text-center text-xs text-[#C7B9A5]">
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchView('login')}
                    className="text-[#E6C594] hover:underline font-semibold">
                    Sign In
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <Field label="Email or WhatsApp Number" name="identifier" value={f.identifier} onChange={handle}
                placeholder="email@example.com or 9876543210" required />

              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#1ebe58] text-white font-bold text-xs uppercase tracking-widest transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Open WhatsApp to Get OTP
                </a>
              )}

              <PrimaryBtn loading={loading}>
                {whatsappUrl ? 'Resend OTP' : 'Send OTP to WhatsApp'}
              </PrimaryBtn>

              {whatsappUrl && (
                <button type="button" onClick={() => setView('verify')}
                  className="w-full py-2.5 border border-[#E6C594]/30 text-[#E6C594] font-bold text-xs uppercase tracking-widest hover:border-[#E6C594]/60 transition-colors">
                  I have the OTP — Reset Password →
                </button>
              )}

              <button type="button" onClick={() => switchView('login')}
                className="w-full text-center text-xs text-[#C7B9A5] hover:text-[#FAF6F0] transition-colors">
                ← Back to Sign In
              </button>
            </form>
          )}

          {/* ── VERIFY / RESET ── */}
          {view === 'verify' && (
            <form onSubmit={handleReset} className="space-y-4">
              <Field label="6-Digit OTP from WhatsApp" name="otp" value={f.otp} onChange={handle}
                placeholder="e.g. 482910" required maxLength={6}
                hint="Check your WhatsApp for the verification code" />
              <PasswordField label="New Password" name="newPassword" value={f.newPassword} onChange={handle}
                placeholder="Min. 6 characters" required />
              <PasswordField label="Confirm New Password" name="confirmNewPassword" value={f.confirmNewPassword} onChange={handle}
                placeholder="Repeat new password" required />
              <PrimaryBtn loading={loading}>Reset Password</PrimaryBtn>
              <button type="button" onClick={() => setView('forgot')}
                className="w-full text-center text-xs text-[#C7B9A5] hover:text-[#FAF6F0] transition-colors">
                ← Back / Resend OTP
              </button>
            </form>
          )}

          {/* ── COMPLETE PROFILE (After Google Signup) ── */}
          {view === 'complete-profile' && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setFeedback(null);
              
              // Validate required fields
              if (!f.phone || f.phone.replace(/\D/g, '').length < 10) {
                setFeedback({ msg: 'Please enter a valid 10-digit phone number', isError: true });
                setLoading(false);
                return;
              }
              
              if (!f.pincode || f.pincode.trim().length !== 6) {
                setFeedback({ msg: 'Please enter a valid 6-digit pincode', isError: true });
                setLoading(false);
                return;
              }

              try {
                // Save profile to backend
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/save`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${f.googleToken}`,
                  },
                  body: JSON.stringify({
                    email: f.googleEmail,
                    phone: f.phone,
                    address: f.address,
                    locality: f.locality,
                    city: f.city,
                    state: f.state,
                    pincode: f.pincode,
                  }),
                });

                const res = await response.json();

                if (res.success) {
                  // Update user store with complete profile
                  login({
                    firstName: f.googleFirstName,
                    lastName: f.googleLastName,
                    email: f.googleEmail,
                    phone: f.phone,
                    address: f.address,
                    locality: f.locality,
                    city: f.city,
                    state: f.state,
                    pincode: f.pincode,
                  }, f.googleToken);

                  setFeedback({ msg: 'Profile completed! Welcome to Thread & Bloom.', isError: false });
                  setTimeout(() => { onClose(); reset(); onLoginSuccess?.(); }, 1500);
                } else {
                  setFeedback({ msg: res.message || 'Failed to save profile', isError: true });
                }
              } catch (err) {
                setFeedback({ msg: 'Network error - please try again', isError: true });
              } finally {
                setLoading(false);
              }
            }} className="space-y-4">
              <div className="bg-[#1A1612] border border-[#E6C594]/20 p-3 mb-4">
                <p className="text-xs text-[#C7B9A5]">
                  <span className="material-symbols-outlined text-sm text-[#E6C594] inline-block mr-1">person</span>
                  <strong className="text-[#FAF6F0]">{f.googleFirstName} {f.googleLastName}</strong>
                </p>
                <p className="text-xs text-[#C7B9A5] mt-1">
                  <span className="material-symbols-outlined text-sm text-[#E6C594] inline-block mr-1">mail</span>
                  {f.googleEmail}
                </p>
              </div>

              <Field label="Phone Number" name="phone" type="tel" value={f.phone} onChange={handle}
                placeholder="9876543210" required maxLength={10}
                hint="We'll use this for order updates via WhatsApp" />
              
              <Field label="Address" name="address" value={f.address} onChange={handle}
                placeholder="House/Flat No., Street" required />
              
              <Field label="Locality/Area" name="locality" value={f.locality} onChange={handle}
                placeholder="Sector, Colony, etc." />
              
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" name="city" value={f.city} onChange={handle}
                  placeholder="City" required />
                <Field label="State" name="state" value={f.state} onChange={handle}
                  placeholder="State" required />
              </div>
              
              <Field label="Pincode" name="pincode" type="text" value={f.pincode} onChange={handle}
                placeholder="110001" required maxLength={6} />

              <PrimaryBtn loading={loading}>Complete Profile</PrimaryBtn>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
