import React from 'react';
import AdminLogin from './AdminLogin';
import AdminLoginMobile from './AdminLoginMobile';
import useScreenSize from '@/admin/hooks/useScreenSize';

const AdminLoginResponsive: React.FC = () => {
  const { isMobile } = useScreenSize();
  
  // Show mobile version for screens smaller than 768px
  // Show desktop version for screens 768px and larger
  return (
    <>
      {isMobile ? <AdminLoginMobile /> : <AdminLogin />}
    </>
  );
};

export default AdminLoginResponsive;