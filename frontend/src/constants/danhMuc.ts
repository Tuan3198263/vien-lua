/**
 * Danh mục constants - Danh sách các dropdown options cố định trong hệ thống
 * Di chuyển từ backend sang frontend để giảm API calls không cần thiết
 */

/**
 * Interface cho danh mục
 */
export interface DanhMucInfo {
  ma_danh_muc: string;
  ten_danh_muc: string;
  danh_sach_gia_tri: string[];
}

/**
 * Danh sách tất cả các danh mục trong hệ thống
 */
export const DANH_SACH_DANH_MUC: DanhMucInfo[] = [
  {
    ma_danh_muc: 'DON_VI_PHE_DUYET',
    ten_danh_muc: 'Đơn vị phê duyệt',
    danh_sach_gia_tri: [
      'Bộ Nông nghiệp & MT',
      'Bộ NN & PTNT',
      'Bộ KH&CN',
      'Khác',
    ],
  },
  {
    ma_danh_muc: 'CAP_QUAN_LY_DE_TAI',
    ten_danh_muc: 'Cấp quản lý đề tài',
    danh_sach_gia_tri: [
      'Cấp Nhà nước',
      'Cấp Bộ',
      'Cấp Tỉnh',
      'Cấp Cơ sở',
    ],
  },
  {
    ma_danh_muc: 'LINH_VUC_KHOA_HOC',
    ten_danh_muc: 'Lĩnh vực khoa học',
    danh_sach_gia_tri: [
      'Tự nhiên',
      'Nông, lâm, ngư nghiệp',
      'Kỹ thuật và công nghệ',
      'Y dược',
      'Khoa học xã hội',
      'Nhân văn',
    ],
  },
  {
    ma_danh_muc: 'PHUONG_THUC_KHOANG_CHI',
    ten_danh_muc: 'Phương thức khoáng chi',
    danh_sach_gia_tri: [
      'Tạm ứng',
      'Thanh toán theo tiến độ',
      'Thanh toán sau khi hoàn thành',
      'Thanh toán một lần',
      'Khác',
    ],
  },
  {
    ma_danh_muc: 'NGUON_GOC_DE_TAI',
    ten_danh_muc: 'Nguồn gốc đề tài',
    danh_sach_gia_tri: [
      'Đề tài độc lập',
      'Đề tài trọng điểm',
      'Dự án quốc gia',
      'Hợp tác quốc tế',
      'Khác',
    ],
  },
  {
    ma_danh_muc: 'LOAI_HO_SO',
    ten_danh_muc: 'Loại hồ sơ lưu trữ',
    danh_sach_gia_tri: [
      'Hồ sơ nghiệm thu',
      'Báo cáo tiến độ',
      'Báo cáo tổng kết',
      'Hợp đồng',
      'Biên bản',
      'Tài liệu khác',
    ],
  },
  {
    ma_danh_muc: 'LOAI_HOP_DONG',
    ten_danh_muc: 'Loại hợp đồng',
    danh_sach_gia_tri: [
      'Hợp đồng nghiên cứu',
      'Hợp đồng tư vấn',
      'Hợp đồng dịch vụ',
      'Hợp đồng cung cấp',
      'Khác',
    ],
  },
  {
    ma_danh_muc: 'TRANG_THAI_HOP_DONG',
    ten_danh_muc: 'Trạng thái hợp đồng',
    danh_sach_gia_tri: [
      'Đang soạn thảo',
      'Chờ phê duyệt',
      'Đã ký',
      'Đang thực hiện',
      'Hoàn thành',
      'Đã hủy',
    ],
  },
  {
    ma_danh_muc: 'NGUON_KINH_PHI',
    ten_danh_muc: 'Nguồn kinh phí',
    danh_sach_gia_tri: [
      'Ngân sách nhà nước',
      'Ngân sách địa phương',
      'Doanh nghiệp',
      'Hợp tác quốc tế',
      'Tự nguồn',
      'Khác',
    ],
  },
  {
    ma_danh_muc: 'TRANG_THAI_DAU_THAU',
    ten_danh_muc: 'Trạng thái đấu thầu',
    danh_sach_gia_tri: [
      'Đang hoàn thành',
      'Hoàn thành',
    ],
  },
  {
    ma_danh_muc: 'HINH_THUC_DAU_THAU',
    ten_danh_muc: 'Hình thức đấu thầu',
    danh_sach_gia_tri: [
      'Chào hàng cạnh tranh',
      'Chỉ định rút gọn',
    ],
  },
  {
    ma_danh_muc: 'BUOC_DAU_THAU',
    ten_danh_muc: 'Bước đấu thầu',
    danh_sach_gia_tri: [
      'Bước 1',
      'Bước 2',
      'Bước cuối',
    ],
  },
];

/**
 * Lấy danh mục theo mã
 */
export function layDanhMucTheoMa(ma: string): DanhMucInfo | undefined {
  return DANH_SACH_DANH_MUC.find((dm) => dm.ma_danh_muc === ma);
}

/**
 * Lấy danh sách giá trị của một danh mục
 */
export function layGiaTriDanhMuc(ma: string): string[] {
  const danhMuc = layDanhMucTheoMa(ma);
  return danhMuc ? danhMuc.danh_sach_gia_tri : [];
}

/**
 * Convert danh sách giá trị thành options cho Select component
 */
export function taoOptionsTuDanhMuc(ma: string): Array<{ label: string; value: string }> {
  const giaTriList = layGiaTriDanhMuc(ma);
  return giaTriList.map((giatri) => ({
    label: giatri,
    value: giatri,
  }));
}
