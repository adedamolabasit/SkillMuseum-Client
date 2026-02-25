export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'signup' | 'signin';
  setActiveTab: (tab: 'signup' | 'signin') => void;
}
