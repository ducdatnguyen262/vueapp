export default {
    // Phím tắt
    KeyCode: {
        // Phím Enter
        ENTER: 13,
        // Phím ESC
        ESC: 27,
        // Phím Shift
        Shift: 16,
        // Phím Ctrl
        Ctrl: 17,
        // Phím F3
        F3: 114,
        // Phím F8
        F8: 119,
        // Phím F9
        F9: 120,
        // Phím `
        SelectTable: 115,
    },

    // Loại dialog chi tiết
    FormMode: {
        // Thêm tài sản
        Add: 1,
        // Sửa tài sản
        Edit: 2,
        // Nhân bản tài sản
        Duplicate: 3
    },

    // Loại combobox
    ComboboxType: {
        // Phòng ban
        Department: 1,
        // Loại tài sản
        Category: 2,
        // Ngân sách
        Budget: 3
    },

    // Danh sách các kiểu lấy bản ghi
    GetRecordMode: {
        // Lấy các bản ghi không được chọn
        NotSelected: 0,
        // Lấy các bản ghi được chọn
        Selected:1,
        // Lấy các bản ghi không được chọn và không ghi tăng
        NotSelectedNotIncrement: 2,
    },
}
