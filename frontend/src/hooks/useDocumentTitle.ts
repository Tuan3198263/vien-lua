import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTE_LABELS } from '@/constants/routes';

/**
 * Custom hook để set document title theo route
 * Tự động cập nhật title khi route thay đổi
 * 
 * @example
 * // Trong component
 * useDocumentTitle();
 */
export const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    
    // Map path to label
    let pageTitle = 'Dashboard';
    
    switch (path) {
      case '/':
        pageTitle = ROUTE_LABELS.TRANG_CHU;
        break;
      case '/nguoi-dung':
        pageTitle = ROUTE_LABELS.NGUOI_DUNG;
        break;
         case '/de-tai':
        pageTitle = ROUTE_LABELS.DE_TAI;
        break;
      case '/vai-tro':
        pageTitle = ROUTE_LABELS.VAI_TRO;
        break;
      case '/hop-dong':
        pageTitle = ROUTE_LABELS.HOP_DONG;
        break;
      case '/tai-lieu':
        pageTitle = ROUTE_LABELS.TAI_LIEU;
        break;
      case '/dang-nhap':
        pageTitle = ROUTE_LABELS.DANG_NHAP;
        break;
      case '/khong-co-quyen':
        pageTitle = ROUTE_LABELS.KHONG_CO_QUYEN;
        break;
      default:
        pageTitle = 'Trang chủ';
    }

    // Set document title
    document.title = `${pageTitle}`;
  }, [location]);
};
