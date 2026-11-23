import React, { useState, useEffect, type FormEvent } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRIES = [
  { code: 'AU', label: 'Australia' },
  { code: 'AT', label: 'Austria' },
  { code: 'BE', label: 'Belgium' },
  { code: 'BG', label: 'Bulgaria' },
  { code: 'CA', label: 'Canada' },
  { code: 'HR', label: 'Croatia' },
  { code: 'CY', label: 'Cyprus' },
  { code: 'CZ', label: 'Czech Republic' },
  { code: 'DK', label: 'Denmark' },
  { code: 'EE', label: 'Estonia' },
  { code: 'FI', label: 'Finland' },
  { code: 'FR', label: 'France' },
  { code: 'DE', label: 'Germany' },
  { code: 'GR', label: 'Greece' },
  { code: 'HU', label: 'Hungary' },
  { code: 'IE', label: 'Ireland' },
  { code: 'IT', label: 'Italy' },
  { code: 'LV', label: 'Latvia' },
  { code: 'LT', label: 'Lithuania' },
  { code: 'LU', label: 'Luxembourg' },
  { code: 'MT', label: 'Malta' },
  { code: 'NL', label: 'Netherlands' },
  { code: 'NO', label: 'Norway' },
  { code: 'PL', label: 'Poland' },
  { code: 'PT', label: 'Portugal' },
  { code: 'RO', label: 'Romania' },
  { code: 'SK', label: 'Slovakia' },
  { code: 'SI', label: 'Slovenia' },
  { code: 'ES', label: 'Spain' },
  { code: 'SE', label: 'Sweden' },
  { code: 'CH', label: 'Switzerland' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'US', label: 'United States' },
];

export default function CheckoutModal({ isOpen, onClose }: Props): React.ReactElement | null {
  const { siteConfig } = useDocusaurusContext();
  const checkoutUrl = (siteConfig.customFields?.checkoutUrl as string) ?? '';

  const [company, setCompany]     = useState('');
  const [email, setEmail]         = useState('');
  const [country, setCountry]     = useState('');
  const [vat, setVat]             = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError]         = useState('');
  const [submitLabel, setSubmitLabel] = useState('Continue to Payment →');
  const [submitting, setSubmitting]   = useState(false);

  const showVat  = Boolean(country) && country !== 'US';
  const vatLabel =
    country === 'GB' ? 'UK VAT Number'
    : country === 'CH' ? 'Swiss VAT Number (UID)'
    : country === 'CA' ? 'GST/HST Number'
    : country === 'NO' ? 'Norwegian VAT Number (MVA)'
    : country === 'AU' ? 'Australian Business Number (ABN)'
    : 'VAT Number';

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!acceptedTerms) {
      setError('Please accept the terms of service to continue.');
      return;
    }
    setSubmitting(true);
    setSubmitLabel('Validating…');

    try {
      const resp = await fetch(checkoutUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: company.trim(),
          email: email.trim(),
          country,
          vat_number: vat.trim(),
        }),
      });

      const data = await resp.json();

      if (!resp.ok || data.error) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setSubmitting(false);
        setSubmitLabel('Continue to Payment →');
        return;
      }

      setSubmitLabel('Redirecting…');
      window.location.href = data.url;
    } catch {
      setError('Could not connect to the checkout service. Please try again.');
      setSubmitting(false);
      setSubmitLabel('Continue to Payment →');
    }
  }

  if (!isOpen) return null;

  // font-[inherit] and appearance-none: no preflight here, so form controls would otherwise keep the browser's font and chrome
  const inputClass =
    'block w-full h-11 rounded border border-black/15 bg-white px-3 text-[15px] font-[inherit] appearance-none transition-colors hover:border-black/30 focus:outline-none focus:border-[#1a4be0] focus:ring-3 focus:ring-[#1a4be0]/15';
  const labelClass = 'block text-sm font-medium text-[#111] mb-1.5';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-md bg-white text-[#111] shadow-2xl">
        <button
          type="button"
          className="absolute top-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-[#6b6b6b] transition-colors hover:bg-black/5 hover:text-[#111]"
          aria-label="Close"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-7 pt-7 pb-6 border-b border-black/10">
          <h2 id="checkout-title" className="text-xl font-medium m-0 mb-3">Business License</h2>
          <p className="m-0 flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight">€349</span>
            <span className="text-sm text-[#6b6b6b]">/ year, excl. VAT</span>
          </p>
          <p className="m-0 mt-1 text-sm text-[#6b6b6b]">Renews annually until cancelled.</p>
        </div>

        <form noValidate className="px-7 pt-6 pb-7 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="co-company" className={labelClass}>Company name</label>
            <input
              id="co-company" type="text" required autoComplete="organization"
              value={company} onChange={e => setCompany(e.target.value)}
              className={`${inputClass} text-[#111]`}
            />
          </div>

          <div>
            <label htmlFor="co-email" className={labelClass}>Work email</label>
            <input
              id="co-email" type="email" required autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              className={`${inputClass} text-[#111]`}
            />
          </div>

          <div>
            <label htmlFor="co-country" className={labelClass}>Country</label>
            <div className="relative">
              <select
                id="co-country" required
                value={country}
                onChange={e => { setCountry(e.target.value); setVat(''); setError(''); }}
                className={`${inputClass} pr-9 cursor-pointer ${country ? 'text-[#111]' : 'text-[#6b6b6b]'}`}
              >
                <option value="">Select country…</option>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code} className="text-[#111]">{c.label}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <p className="m-0 mt-1.5 text-xs text-[#6b6b6b]">
              For companies in the listed countries. Country missing? <a href="mailto:johan@yopass.se" className="text-[#1a4be0] underline underline-offset-2">Contact us</a>.
            </p>
          </div>

          {showVat && (
            <div>
              <label htmlFor="co-vat" className={labelClass}>{vatLabel}</label>
              <input
                id="co-vat" type="text" autoComplete="off" placeholder={country === 'CH' ? 'e.g. CHE-123.456.789' : country === 'CA' ? 'e.g. 123456782RT0001' : country === 'NO' ? 'e.g. 974760673MVA' : country === 'AU' ? 'e.g. 51 824 753 556' : 'e.g. DE811257892'}
                value={vat} onChange={e => setVat(e.target.value)}
                className={`${inputClass} text-[#111] font-mono placeholder:text-[#767676]`}
              />
              <p className="m-0 mt-1.5 text-xs text-[#6b6b6b]">{country === 'CA' ? 'Required for Canadian companies. Enter your GST/HST Business Number.' : country === 'NO' ? 'Required for Norwegian companies. Enter your MVA organisation number.' : country === 'AU' ? 'Required for Australian companies. Enter your 11-digit ABN.' : 'Required for EU, UK, and Swiss companies. Used for B2B reverse-charge VAT.'}</p>
            </div>
          )}

          <label className="flex items-start gap-2.5 pt-1 text-sm text-[#444] cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={e => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#1a4be0]"
            />
            <span>
              I accept the{' '}
              <a href="/tos" target="_blank" rel="noopener noreferrer" className="text-[#111] underline underline-offset-2">Terms of Service</a>
              {' '}and <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#111] underline underline-offset-2">Privacy Policy</a>.
            </span>
          </label>

          {error && <p role="alert" className="m-0 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="button--primary w-full cursor-pointer text-base! disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>

          <p className="m-0 flex items-center justify-center gap-1.5 text-xs text-[#6b6b6b]">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth={2} />
              <path d="M8 11V7a4 4 0 018 0v4" strokeWidth={2} strokeLinecap="round" />
            </svg>
            Subscription handled by Stripe · Sold by Yopass AB
          </p>
        </form>

        <p className="m-0 px-7 py-4 bg-black/[0.03] border-t border-black/10 text-xs text-[#6b6b6b] text-center">
          Need an invoice before purchasing, or have questions? Email{' '}
          <a href="mailto:johan@yopass.se" className="text-[#111] underline underline-offset-2">johan@yopass.se</a>{' '}
          and we'll sort it out.
        </p>
      </div>
    </div>
  );
}
