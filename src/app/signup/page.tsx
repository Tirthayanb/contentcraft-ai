'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { BrandLogo } from '@/components/brand/brand-logo';
import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

const API_URL = '/api/auth/signup';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  _form?: string;
}

const emptyForm: FormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const emptyErrors: FieldErrors = {};


function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
        fill="#4285F4"
      />
      <path
        d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(emptyErrors);
  const [formError, setFormError] = useState<string | null>(null);

  const clearFieldError = useCallback((name: keyof FormData) => {
    setFieldErrors((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const errors: FieldErrors = {};
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);
      setFieldErrors(emptyErrors);

      if (!validate()) return;

      setLoading(true);
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (res.status === 400 && data.details) {
            const fieldErrors: FieldErrors = {};
            const formErrors = data.details as Record<string, { message: string }[]>;
            for (const [key, value] of Object.entries(formErrors)) {
              if (value?.[0]?.message) {
                fieldErrors[key as keyof FormData] = value[0].message;
              }
            }
            setFieldErrors(fieldErrors);
            return;
          }
          if (res.status === 409) {
            setFormError(data.error || 'Account already exists');
            return;
          }
          setFormError(data.error || 'Signup failed');
          return;
        }

        router.replace('/dashboard');
      } catch {
        setFormError('Signup failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [formData, validate, router]
  );

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) clearFieldError(field);
    if (formError) setFormError(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAF8] text-[#252A23] flex flex-col justify-between selection:bg-[#EAE8E3]">
      {/* Header: matched to reference (border #E4E6DE, logo at x=112 y=29, h=88) */}
      <header className="w-full border-b border-[#E4E6DE] bg-[#FAFAF8]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-28 h-[88px] flex justify-between items-center">
          <Link
            href="/"
            aria-label="Go to home page"
            className="flex items-center gap-3 cursor-pointer group rounded-md transition-all duration-200 hover:opacity-80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#383E36] focus-visible:ring-offset-2"
          >
            <BrandLogo size="md" priority />
          </Link>
          <ThemeToggle size="sm" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-28 py-8 md:py-12 xl:py-16 flex-1 flex items-center">
        <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16">
          {/* Left Column (Hero Section) */}
          <section className="w-full lg:w-[537px] shrink-0 pt-0 lg:pt-8 order-2 lg:order-1">
            <div className="mb-4">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#74786F] font-semibold">
                A LITTLE CLARITY STARTS HERE
              </span>
            </div>
            <h1 className="text-[40px] sm:text-[48px] lg:text-[54px] font-bold tracking-tight leading-[1.08] text-[#252A23]">
              Your next chapter,<br />
              better expressed.
            </h1>
            <p className="mt-5 text-[15px] sm:text-[16px] text-[#74786F] leading-relaxed max-w-[480px]">
              A calmer place to write, refine, and bring your ideas to life. Create an
              account and make every draft a little better.
            </p>

            {/* Feature Card */}
            <div className="mt-10 sm:mt-12 bg-[#EDF1E9] rounded-[20px] p-6 sm:p-7 w-full max-w-[537px]">
              <div className="flex items-center gap-2.5 mb-3.5">
                <Sparkles className="w-4 h-4 text-[#71816B] shrink-0" />
                <span className="text-[14px] font-semibold text-[#252A23]">
                  Your first draft, and everything after.
                </span>
              </div>
              <p className="text-[14px] font-medium text-[#485344] leading-snug mb-3">
                One idea. Four ways forward.
              </p>
              <ul className="space-y-1.5 text-[13px] text-[#71816B] leading-relaxed">
                <li className="flex items-start">
                  Summarize a long read. Rewrite a rough draft. Simplify the complex.
                </li>
                <li className="flex items-start">
                  Shape your next social post.
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-[#DFE5D9]/70">
                <p className="text-[12px] text-[#869581]">
                  Your voice, always.
                </p>
              </div>
            </div>
          </section>

          {/* Right Column (Signup Card) - exact width 568px on desktop */}
          <section className="w-full lg:w-[568px] shrink-0 order-1 lg:order-2 mx-auto lg:mx-0">
            <div className="bg-white border border-[#E4E6DE] rounded-[24px] sm:rounded-[28px] p-7 sm:p-9 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="mb-6">
                <h2 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-[#252A23]">
                  Create your account
                </h2>
                <p className="mt-1.5 text-[14px] sm:text-[15px] text-[#74786F]">
                  A fresh start for your next great idea.
                </p>
              </div>

              {/* Continue with Google Button */}
              <button
                type="button"
                className="w-full h-[48px] rounded-[10px] border border-[#E4E6DE] bg-white hover:bg-[#FAFAF8] text-[14px] font-medium text-[#252A23] flex items-center justify-center gap-2.5 transition-colors disabled:opacity-80 disabled:cursor-not-allowed"
                disabled
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
              <p className="text-[12px] text-[#8C9187] text-center mt-2.5 mb-6">
                Create or connect your account with Google. No form needed.
              </p>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E4E6DE]" />
                </div>
                <div className="relative bg-white px-3">
                  <span className="text-[12px] text-[#8C9187]">or</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#4F544A] uppercase tracking-wider block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => clearFieldError('name')}
                    placeholder="Enter your full name"
                    className="w-full h-[48px] px-4 text-[14px] text-[#252A23] placeholder:text-[#A4AAA0] rounded-[10px] border border-[#E4E6DE] bg-white focus:border-[#383E36] focus:ring-1 focus:ring-[#383E36] outline-none transition-all disabled:opacity-70"
                    disabled={loading}
                    autoComplete="name"
                  />
                  {fieldErrors.name && (
                    <p className="text-[11px] text-[#DC2626] flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#4F544A] uppercase tracking-wider block">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => clearFieldError('email')}
                    placeholder="you@example.com"
                    className="w-full h-[48px] px-4 text-[14px] text-[#252A23] placeholder:text-[#A4AAA0] rounded-[10px] border border-[#E4E6DE] bg-white focus:border-[#383E36] focus:ring-1 focus:ring-[#383E36] outline-none transition-all disabled:opacity-70"
                    disabled={loading}
                    autoComplete="email"
                  />
                  {fieldErrors.email && (
                    <p className="text-[11px] text-[#DC2626] flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#4F544A] uppercase tracking-wider block">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => clearFieldError('password')}
                    placeholder="Create a password"
                    className="w-full h-[48px] px-4 text-[14px] text-[#252A23] placeholder:text-[#A4AAA0] rounded-[10px] border border-[#E4E6DE] bg-white focus:border-[#383E36] focus:ring-1 focus:ring-[#383E36] outline-none transition-all disabled:opacity-70"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <p className="text-[11px] text-[#8C9187] mt-1">
                    Use at least 8 characters.
                  </p>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-[#DC2626] flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#4F544A] uppercase tracking-wider block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => clearFieldError('confirmPassword')}
                    placeholder="Re-enter your password"
                    className="w-full h-[48px] px-4 text-[14px] text-[#252A23] placeholder:text-[#A4AAA0] rounded-[10px] border border-[#E4E6DE] bg-white focus:border-[#383E36] focus:ring-1 focus:ring-[#383E36] outline-none transition-all disabled:opacity-70"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="text-[11px] text-[#DC2626] flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {formError && (
                  <div className="rounded-[10px] bg-[#FEF2F2] border border-[#FCA5A5] p-3 text-[12px] text-[#B91C1C] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-[48px] mt-2 bg-[#383E36] hover:bg-[#2A2E28] text-white text-[14px] font-medium rounded-[10px] flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-none cursor-pointer"
                  disabled={loading}
                >
                  <span>Create account</span>
                  {loading ? null : (
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  )}
                </Button>

                <p className="text-[11px] text-[#8C9187] text-center leading-relaxed pt-2">
                  By creating an account, you agree to our{' '}
                  <a
                    href="/terms"
                    className="text-[#555C50] underline underline-offset-2 hover:text-[#252A23]"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="/privacy"
                    className="text-[#555C50] underline underline-offset-2 hover:text-[#252A23]"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>

                <p className="text-[13px] text-[#74786F] text-center pt-2">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="text-[#252A23] font-semibold underline underline-offset-2 hover:text-[#383E36]"
                  >
                    Log in
                  </a>
                </p>
              </form>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E4E6DE] bg-[#FAFAF8] mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-28 h-[76px] flex flex-col sm:flex-row justify-between items-center gap-3 text-[13px] text-[#8C9187]">
          <span>Your ideas. Your voice. A little more clarity.</span>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="/privacy"
              className="hover:text-[#252A23] transition-colors"
            >
              Privacy Policy
            </a>
            <span className="w-1 h-1 rounded-full bg-[#8C9187]" />
            <a
              href="/terms"
              className="hover:text-[#252A23] transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
