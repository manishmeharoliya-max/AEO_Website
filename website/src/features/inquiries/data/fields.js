import { industries } from '../../../data/industries.js';
import { detailedServices } from '../../../data/services.js';
export const auditFields = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
  },
  {
    name: 'email',
    label: 'Business Email',
    type: 'email',
    required: true,
  },
  {
    name: 'company',
    label: 'Company Name',
    type: 'text',
    required: true,
  },
  {
    name: 'website',
    label: 'Website URL',
    type: 'url',
    required: true,
  },
  {
    name: 'country',
    label: 'Target Country',
    type: 'text',
    required: true,
  },
  {
    name: 'industry',
    label: 'Industry',
    type: 'select',
    options: industries.map((industry) => industry[0]),
    placeholder: 'Select an industry',
    required: true,
  },
  {
    name: 'service',
    label: 'Main Service',
    type: 'text',
    required: true,
  },
  {
    name: 'competitors',
    label: 'Main Competitors',
    type: 'text',
    required: false,
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    required: false,
  },
];
export const contactFields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
  },
  {
    name: 'email',
    label: 'Business Email',
    type: 'email',
    required: true,
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    required: false,
  },
  {
    name: 'company',
    label: 'Company',
    type: 'text',
    required: false,
  },
  {
    name: 'website',
    label: 'Website',
    type: 'url',
    required: false,
  },
  {
    name: 'service',
    label: 'Required Service',
    type: 'select',
    options: detailedServices.map((service) => service.title),
    placeholder: 'Select a service',
    required: true,
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    required: true,
  },
];
