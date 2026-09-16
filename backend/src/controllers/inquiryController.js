const { createInquiry, listInquiries } = require('../models/inquiryModel');

const fields = ['name', 'email', 'phone', 'company', 'website', 'country', 'industry', 'service', 'competitors', 'message'];

async function submitInquiry(req, res) {
  const { type, details } = req.body || {};
  if (!['audit', 'contact'].includes(type) || !details || typeof details !== 'object' || Array.isArray(details)) {
    return res.status(400).json({ message: 'Enter valid inquiry details.' });
  }
  const required = type === 'audit'
    ? ['name', 'email', 'company', 'website', 'country', 'industry', 'service']
    : ['name', 'email', 'service', 'message'];
  const clean = {};
  for (const field of fields) {
    const value = details[field] ?? '';
    if (typeof value !== 'string' || value.length > (field === 'message' ? 5000 : 2048)) {
      return res.status(400).json({ message: `Invalid ${field}.` });
    }
    clean[field] = value.trim();
    if (required.includes(field) && !clean[field]) {
      return res.status(400).json({ message: `${field} is required.` });
    }
  }
  if (clean.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }
  if (clean.website) {
    try {
      const url = new URL(clean.website);
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error();
    } catch {
      return res.status(400).json({ message: 'Enter a complete HTTP or HTTPS website URL.' });
    }
  }
  if (clean.phone && !/^[+\d\s().-]{7,25}$/.test(clean.phone)) {
    return res.status(400).json({ message: 'Enter a valid phone number.' });
  }
  const inquiry = await createInquiry(type, clean);
  return res.status(201).json({ id: inquiry.id, message: 'Your inquiry has been received.' });
}

async function getInquiries(req, res) {
  return res.json(await listInquiries());
}

module.exports = { submitInquiry, getInquiries };
