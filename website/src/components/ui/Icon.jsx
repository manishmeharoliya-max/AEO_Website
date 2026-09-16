import {
  ScanSearch,
  MessagesSquare,
  FileText,
  CodeXml,
  ShieldCheck,
  ChartNoAxesCombined,
  Layers,
  HeartPulse,
  ShoppingBag,
  BriefcaseBusiness,
  House,
  GraduationCap,
  Landmark,
  MapPin,
  PanelsTopLeft,
  Network,
  Sparkles,
} from 'lucide-react';
export const icons = {
  ScanSearch,
  MessagesSquare,
  FileText,
  CodeXml,
  ShieldCheck,
  ChartNoAxesCombined,
  Layers,
  HeartPulse,
  ShoppingBag,
  BriefcaseBusiness,
  House,
  GraduationCap,
  Landmark,
  MapPin,
  PanelsTopLeft,
  Network,
};
export function Icon({ name, ...props }) {
  const Component = icons[name] || Sparkles;
  return <Component {...props} />;
}
