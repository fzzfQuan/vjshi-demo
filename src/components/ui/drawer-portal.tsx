'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

interface DrawerPortalProps {
  children: React.ReactNode;
}

export const DrawerPortal: React.FC<DrawerPortalProps> = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};