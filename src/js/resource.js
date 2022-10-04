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
        Add: "Thêm tài sản",
        Edit: "Sửa tài sản",
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
    },

    // Loại combobox
    ComboboxType: {
        //Phòng ban
        Department: "Department",
        //Loại tài sản
        Category: "Category"
    },

    //Phòng ban
    Department: {
        // Id phòng ban
        Id: "department_id",
        // Mã phòng ban
        Code: "department_code",
        // Tên phòng ban
        Name: "department_name"
    },

    //Phòng ban
    Category: {
        // Id loại tài sản
        Id: "fixed_asset_category_id",
        // Mã loại tài sản
        Code: "fixed_asset_category_code",
        // Tên loại tài sản
        Name: "fixed_asset_category_name"
    },

    //Error Code
    ErrorCode: {
        400: "Dữ liệu đầu vào ko hợp lệ",
        500: "Lỗi phía Server"
    },

    //Error Message
    ErrorMsg: {
        CloseMsg: "Bạn có muốn hủy bỏ khai báo tài sản này?",
        CloseEditedMsg: "Thông tin thay đổi sẽ không được cập nhật nếu bạn không lưu. Bạn có muốn lưu các thay đổi này?",
        ValidateEmpty: "Cần phải nhập thông tin: ",
        ValidateDuplicateCode: "Mã tài sản đã tồn tại",
    },

    //Url
    Url: {
        Asset: "https://localhost:7148/api/v1/Assets",
        Department: "https://localhost:7148/api/v1/Departments",
        Category: "https://localhost:7148/api/Categories"
    }
}
