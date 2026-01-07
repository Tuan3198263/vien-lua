/**
 * Danh sách các danh mục (dropdown options) dùng chung trong hệ thống
 * File cố định, thêm danh mục mới bằng cách thêm vào DANH_SACH_DANH_MUC
 */

export interface DanhMucInfo {
  ma_danh_muc: string; // Mã danh mục (dùng trong code)
  ten_danh_muc: string; // Tên danh mục (hiển thị)
  danh_sach_gia_tri: string[]; // Danh sách các giá trị lựa chọn
}

/**
 * Danh sách tất cả các danh mục trong hệ thống
 * Thêm danh mục mới: thêm 1 object vào array này
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
  // ===== THÊM DANH MỤC MỚI Ở ĐÂY =====
  // {
  //   ma_danh_muc: 'MA_DANH_MUC_MOI',
  //   ten_danh_muc: 'Tên danh mục mới',
  //   danh_sach_gia_tri: ['Giá trị 1', 'Giá trị 2'],
  // },
];

/**
 * Lấy danh mục theo mã
 */
export function layDanhMucTheoMa(ma: string): DanhMucInfo | undefined {
  return DANH_SACH_DANH_MUC.find((dm) => dm.ma_danh_muc === ma);
}
