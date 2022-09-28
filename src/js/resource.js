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
        Code: "mã tài sản",
        Name: "tên tài sản"
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
    }
}
