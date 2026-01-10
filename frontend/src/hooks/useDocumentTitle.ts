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
      case '/dau-thau':
        pageTitle = ROUTE_LABELS.DAU_THAU;
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
        // Handle dynamic routes
        if (path.startsWith('/de-tai/them')) {
          pageTitle = 'Thêm đề tài';
        } else if (path.startsWith('/de-tai/sua/')) {
          pageTitle = 'Sửa đề tài';
        } else if (path.startsWith('/de-tai/')) {
          pageTitle = 'Chi tiết đề tài';
        } else if (path.startsWith('/dau-thau/them')) {
          pageTitle = 'Thêm đấu thầu';
        } else if (path.startsWith('/dau-thau/sua/')) {
          pageTitle = 'Sửa đấu thầu';
        } else {
          pageTitle = 'Trang chủ';
        }
    }

    // Set document title
    document.title = `${pageTitle}`;
  }, [location]);
};
