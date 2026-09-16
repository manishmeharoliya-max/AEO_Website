import { ArrowRight, LockKeyhole } from 'lucide-react';
import { auditFields, contactFields } from '../data/fields.js';
import { useInquiryForm } from '../hooks/useInquiryForm.js';
import { FormField } from './FormField.jsx';
import { SuccessMessage } from './SuccessMessage.jsx';

export function InquiryForm({ audit = false, initialValues = {}, selectedPlan }) {
  const fields = audit ? auditFields : contactFields;
  const { values, errors, submission, busy, submitError, handleChange, handleSubmit, resetForm } =
    useInquiryForm(fields, initialValues, audit ? 'audit' : 'contact');
  if (submission) return <SuccessMessage audit={audit} onReset={resetForm} />;
  return (
    <form
      className={[
        'inquiry-form p-[33px] border border-[#e2e8f0] rounded-[13px]',
        'shadow-[0_10px_35px_#102a4306] [&_h2]:text-[24px] [&>.button]:w-full max-[950px]:p-[24px]',
        'max-[720px]:p-[24px] max-[380px]:p-[20px]',
      ].join(' ')}
      onSubmit={handleSubmit}
      noValidate
    >
      {selectedPlan && (
        <div
          className={[
            'selected-plan mb-[22px] p-[18px] bg-[#eef4ff] border border-[#cbdcf8] rounded-[8px]',
            '[&_h3]:text-[15px] [&_p]:text-[12px] [&_p]:mt-[7px] [&_p]:[overflow-wrap:anywhere]',
          ].join(' ')}
        >
          <h3>{selectedPlan.name} plan enquiry</h3>
          <p>
            Starting at ${selectedPlan.price} {selectedPlan.interval}. Final scope and
            price are confirmed after a website review.
          </p>
          <p>Submit an enquiry to discuss the scope with our team.</p>
        </div>
      )}
      <h2>{audit ? 'Request your free analysis' : 'Tell us about your business'}</h2>
      <p className="form-intro text-[12px] mt-[10px] mx-0 mb-[25px]">
        A little context helps us understand your starting point.
      </p>
      <div
        className={[
          'form-grid grid grid-cols-[1fr_1fr] gap-[20px_17px] max-[950px]:gap-[16px_12px]',
          'max-[380px]:grid-cols-[1fr]',
        ].join(' ')}
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={values[field.name] || ''}
            error={errors[field.name]}
            onChange={handleChange}
          />
        ))}
      </div>
      <p className="form-note flex gap-[7px] items-start text-[10px] leading-[1.7] my-[20px] mx-0 text-[#7c899e]">
        <LockKeyhole size={14} /> Your details are shared with our team to respond to your inquiry.
      </p>
      {submitError && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{submitError}</p>}
      <button
        className={[
          'button inline-flex justify-center items-center gap-[13px] bg-[#2563eb] text-white',
          'min-h-[47px] py-[13px] px-[20px] border border-[#2563eb] rounded-[7px] text-[12px]',
          'font-semibold leading-[1.5] whitespace-nowrap shadow-[0_3px_6px_#2563eb0c] hover:bg-[#1d4ed8]',
          'hover:shadow-[0_5px_15px_#2563eb20] hover:[transform:translateY(-1px)]',
        ].join(' ')}
        type="submit"
        disabled={busy}
      >
        {busy ? 'Submitting…' : audit ? 'Request My AEO Analysis' : 'Send Message'} <ArrowRight size={16} />
      </button>
    </form>
  );
}
