import { useLocation } from 'react-router-dom';
import SectionPlaceholder from '@/components/SectionPlaceholder';

export default function DynamicPlaceholderPage() {
  const location = useLocation();
  return <SectionPlaceholder sectionPath={location.pathname} />;
}
