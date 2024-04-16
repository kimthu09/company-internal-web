package com.ciw.backend.constants;

public class Message {
	public static final String PASSWORD_VALIDATE = "Mật khẩu phải từ 6 đến 20 ký tự";
	public static final String EMAIL_VALIDATE = "Email không đúng định dạng";
	public static final String USER_NOT_LOGIN = "Xin vui lòng đăng nhập để sử dụng chức năng";
	public static final String USER_NOT_HAVE_FEATURE = "Bạn không có quyền sử dụng chức năng này";
	public static final String USER_NOT_EXIST = "Người dùng không tồn tại trong hệ thống";
	public static final String CAN_NOT_SEND_EMAIL = "Không thể gửi mail cho người dùng";
	public static final String TOKEN_NOT_EXIST = "Token không tồn tại. Xin vui lòng kiểm tra lại email";
	public static final String TOKEN_EXPIRED = "Token đã hết hạn. Xin vui lòng điền lại form quên mật khẩu";
	public static final String COMMON_ERR = "Đã có lỗi xảy ra. Xin hãy thử lại sau";
	public static final String JSON_ERR = "JSON không đúng định dạng";
	public static final String TIME_INVALID_FORMAT = "Thời gian cần có định dạng yyyy-MM-dd HH:mm:ss";
	public static class	User{
		public static final String NAME_VALIDATE = "Tên người dùng không được trống và tối đa 200 ký tự";
		public static final String OLD_PASSWORD_NOT_CORRECT = "Mật khẩu cũ không khớp";
	}
	public static class	Page{
		public static final String PAGE_VALIDATE = "Số trang phải lớn hơn 0";
		public static final String PAGE_LIMIT = "Số lượng hiển thị phải lớn hơn 0";
	}
	public static class	Tag{
		public static final String TAG_NAME_INVALID = "Tên tag không được trống và tối đa 50 ký tự";
		public static final String TAG_NOT_EXIST = "Tag không tồn tại";
	}
	public static class	Post{
		public static final String POST_TITLE_VALIDATE = "Tiêu đề bài viết không được để trống và tối đa 100 ký tự";
		public static final String POST_DESCRIPTION_VALIDATE = "Mô tả bài viết không được dài hơn 200 ký tự";
		public static final String POST_CONTENT_EMPTY = "Nội dung bài viết không được để trống";
		public static final String POST_NOT_EXIST = "Bài viết không tồn tại";
	}
	public static class File {
		public static final String FILE_UPLOAD_FAIL = "Đã có lỗi xảy ra đối với việc upload file. Xin hãy thử lại sau";
		public static final String FILE_INVALID_FORMAT = "File không đúng định dạng. Xin hãy thử file khác";
	}
	public static class Auth{
		public static final String USER_NOT_CORRECT = "Email hoặc mật khẩu chưa đúng. Xin hãy thử lại";
	}
}
