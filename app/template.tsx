'use client';

import { usePathname } from 'next/navigation';
import { ClientLayoutWrapper } from '@/components/client-layout-wrapper';

const SHOW_FIXED_SERVICE_INFO = false;

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Routes admin : pas de ClientLayoutWrapper
    return <>{children}</>;
  }

  // Routes normales : avec ClientLayoutWrapper
  return (
    <ClientLayoutWrapper showFixedServiceInfo={SHOW_FIXED_SERVICE_INFO}>
      {children}
    </ClientLayoutWrapper>
  );
}
