export default {
    // Các method khi gọi API
    Method: {
        Get: "GET",
        Post: "POST",
        Put: "PUT",
        Delete: "DELETE"
    },

    // Tiêu đề cho dialog chi tiết tài sản
    DialogTitle: {
        // Thêm
        Add: "Thêm tài sản",
        // Sửa
        Edit: "Sửa tài sản",
        // Nhân bản
        Duplicate: "Nhân bản tài sản"
    },

    // Các thông báo nếu nhập thiếu
    IsEmpty: {
        code: "Mã tài sản",
        name: "Tên tài sản",
        department: "Mã bộ phận sử dụng",
        category: "Mã loại tài sản",
        quantity: "Số lượng",
        cost: "Nguyên giá",
        depreciation_rate: "Tỉ lệ hao mòn",
        purchase_date: "Ngày mua",
        production_date: "Ngày bắt đầu sử dụng",
        life_time: "Số năm sử dụng",
        depreciation_year: "Giá trị hao mòn năm",
        voucher_code: "Mã chứng từ",
        voucher_date: "Ngày bắt đầu sử dụng",
        increment_date: "Ngày ghi tăng",
        source_name: "Nguồn hình thành",
        source_cost: "Giá trị"
    },

    // Loại combobox
    ComboboxType: {
        // Phòng ban
        Department: "Department",
        // Loại tài sản
        Category: "Category",
        // Ngân sách
        Budget: "Budget"
    },

    // Phòng ban
    Department: {
        // Id phòng ban
        Id: "department_id",
        // Mã phòng ban
        Code: "department_code",
        // Tên phòng ban
        Name: "department_name"
    },

    // Loại tài sản
    Category: {
        // Id loại tài sản
        Id: "fixed_asset_category_id",
        // Mã loại tài sản
        Code: "fixed_asset_category_code",
        // Tên loại tài sản
        Name: "fixed_asset_category_name"
    },

    // Ngân sách
    Budget: {
        // Id ngân sách
        Id: "budget_id",
        // Tên ngân sách
        Name: "budget_name"
    },

    // Text của Toast
    Toast: {
        // Thành công
        success: "Lưu dữ liệu thành công.",
        // Thất bại
        failed: "Có lỗi xảy ra."
    },

    // Mã lỗi
    ErrorCode: {
        // Error 400
        400: "Dữ liệu đầu vào không hợp lệ",
        // Error 405
        405: "Phương thức yêu cầu của bạn không hợp lệ hoặc không được cho phép tại server",
        // Error 500
        500: "Lỗi phía Server"
    },

    // Error Message
    ErrorMsg: {
        // Lời nhắn khi đóng
        CloseMsg: "Bạn có muốn hủy bỏ khai báo tài sản này?",
        // Lời nhắn khi đóng mà trước đó đã sửa đổi
        CloseEditedMsg: "Thông tin thay đổi sẽ không được cập nhật nếu bạn không lưu. Bạn có muốn lưu các thay đổi này?",
        // Lời nhắn khi nhập thiếu
        ValidateEmpty: "Cần phải nhập thông tin: ",
        // Lời nhắn khi trùng mã tài sản
        ValidateDuplicateCode: "Mã tài sản đã tồn tại",
        // Lời nhắn khi trùng nguồn chi phí
        ValidateDuplicateSource: "Nguồn chi phí đã tồn tại",
    },

    // Url
    Url: {
        // Url của tài sản
        Asset: "https://localhost:7148/api/v1/Assets",
        // Url của phòng ban
        Department: "https://localhost:7148/api/v1/Departments",
        // Url của loại tài sản
        Category: "https://localhost:7148/api/v1/Categories",
        // Url của ngân sách
        Budget: "https://localhost:7148/api/v1/Budgets",
        // Url của ghi tăng
        Voucher: "https://localhost:7148/api/v1/Vouchers",
    },

    // Tiêu đề
    Title: {
        // Thêm
        Add: "Thêm",
        // Sửa
        Edit: "Sửa",
        // Nhân bản
        Duplicate: "Nhân bản",
    },

    // Các loại thao tác với chi tiết chứng từ
    VoucherDetailType: {
        // Thêm nhiều
        Add: "batch-add",
        // Xóa nhiều
        Delete: "batch-delete",
    },

    // Mã ngôn ngữ
    LanguageCode: {
        // Việt Nam
        VN: 'vi-VN',
        // Hoa kỳ
        US: 'en-US',
    },

    // Định dạng ngày tháng
    DateFormat: {
        // Việt Nam
        VN: 'DD/MM/YYYY',
        // Hoa kỳ
        US: 'MM/DD/YYYY',
    },

    // Chiều cao trong giao diện ghi tăng (đơn vị vh)
    VoucherListSize: {
        // Phần nội dung chính
        Content: 78,
        // Bảng 1 bình thường
        Table1Normal: 42,
        // Bảng 1 mở rộng
        Table1Expand: 76,
        // Toolbar trên bảng 1
        Table1Toolbar: 6,
        // Toolbar trên bảng 1
        Table2Toolbar: 3,
    },
}
