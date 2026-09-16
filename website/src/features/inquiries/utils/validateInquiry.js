function isWebsiteUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.');
  } catch {
    return false;
  }
}
export function validateInquiry(fields, values) {
  const errors = {};
  for (const { name, label, type, required } of fields) {
    const value = (values[name] || '').trim();
    if (!value) {
      if (required) errors[name] = `Please enter ${label.toLowerCase()}.`;
      continue;
    }
    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[name] = 'Enter a valid email address.';
    }
    if (type === 'url' && !isWebsiteUrl(value)) {
      errors[name] = 'Enter a complete website URL, such as https://example.com.';
    }
    if (type === 'tel' && !/^[+\d\s().-]{7,25}$/.test(value)) {
      errors[name] = 'Enter a valid phone number.';
    }
  }
  return errors;
}
