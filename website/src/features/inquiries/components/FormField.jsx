const autocompleteValues = {
  name: 'name',
  email: 'email',
  phone: 'tel',
  company: 'organization',
  website: 'url',
  country: 'country-name',
};
export function FormField({ field, value, error, onChange }) {
  const { name, label, type, required, options } = field;
  const inputProps = {
    id: `field-${name}`,
    name,
    value,
    onChange,
    required,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `error-${name}` : undefined,
  };
  function renderInput() {
    if (type === 'textarea') {
      return (
        <textarea
          {...inputProps}
          rows={4}
          placeholder="What would you like to improve?"
          maxLength={4000}
        />
      );
    }
    if (options) {
      return (
        <select {...inputProps}>
          <option value="">{field.placeholder}</option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
          <option>Other / not sure yet</option>
        </select>
      );
    }
    const placeholder =
      type === 'url'
        ? 'https://example.com'
        : type === 'email'
          ? 'you@company.com'
          : undefined;
    return (
      <input
        {...inputProps}
        type={type}
        maxLength={300}
        autoComplete={autocompleteValues[name]}
        placeholder={placeholder}
      />
    );
  }
  return (
    <div
      className={[
        [
          'field min-w-0 [&_label]:block [&_label]:text-[11px] [&_label]:font-semibold',
          '[&_label]:mb-[8px] [&_label>span]:text-[#2563eb] [&_label_small]:text-[9px]',
          '[&_label_small]:text-[#8793a4] [&_label_small]:font-normal [&_input]:w-full',
          '[&_input]:border [&_input]:border-[#dce3ed] [&_input]:rounded-[6px] [&_input]:bg-white',
          '[&_input]:min-h-[43px] [&_input]:p-[11px] [&_input]:text-[12px] [&_input]:text-[#34445d]',
          '[&_select]:w-full [&_select]:border [&_select]:border-[#dce3ed] [&_select]:rounded-[6px]',
          '[&_select]:bg-white [&_select]:min-h-[43px] [&_select]:p-[11px] [&_select]:text-[12px]',
          '[&_select]:text-[#34445d] [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[#dce3ed]',
          '[&_textarea]:rounded-[6px] [&_textarea]:bg-white [&_textarea]:min-h-[100px]',
          '[&_textarea]:p-[11px] [&_textarea]:text-[12px] [&_textarea]:text-[#34445d]',
          '[&_textarea]:resize-y [&_input::placeholder]:text-[#98a3b2]',
          "[&_textarea::placeholder]:text-[#98a3b2] [&_[aria-invalid='true']]:border-[#c73636]",
        ].join(' '),
        type === 'textarea' ? 'field-full [&.field-full]:[grid-column:1/-1]' : '',
      ].join(' ')}
    >
      <label htmlFor={inputProps.id}>
        {label} {required ? <span aria-hidden="true">*</span> : <small>(optional)</small>}
      </label>
      {renderInput()}
      {error && (
        <span
          className="field-error block text-[#b42323] text-[10px] leading-[1.6] mt-[5px]"
          id={`error-${name}`}
        >
          {error}
        </span>
      )}
    </div>
  );
}
