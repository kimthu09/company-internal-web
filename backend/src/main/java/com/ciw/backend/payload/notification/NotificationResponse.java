package com.ciw.backend.payload.notification;

import com.ciw.backend.payload.staff.SimpleStaffResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class NotificationResponse {
	@Schema(
			name = "id",
			example = "1"
	)
	private Long id;

	@Schema(
			name = "title",
			example = "Tiêu đề bài viết"
	)
	private String title;

	@Schema(
			name = "description",
			example = "Mô tả bài viết"
	)
	private String description;

	@Schema(name = "from")
	private SimpleStaffResponse from;

	@Schema(name = "to")
	private SimpleStaffResponse to;

	@Schema(name = "createdAt")
	private Date createdAt;

	@Schema(name = "seen")
	private Boolean seen;
}
