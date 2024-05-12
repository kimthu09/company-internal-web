package com.ciw.backend.payload.post;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.payload.staff.SimpleStaffResponse;
import com.ciw.backend.payload.tag.TagResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SimplePostResponse {
	@Schema(
			name = "id",
			example = "1"
	)
	private Long id;

	@Schema(
			name = "title",
			example = "Tiêu đề bài post"
	)
	private String title;

	@Schema(
			name = "description",
			example = "Bài post siêu hay. super hay. Nên đọc. <3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333"
	)
	private String description;

	@Schema(
			name = "image",
			example = ApplicationConst.DEFAULT_POST_IMAGE
	)
	private String image;

	@Schema(name = "createdBy")
	private SimpleStaffResponse createdBy;

	@Schema(
			name = "updatedAt",
			example = "2024-04-16 5:14:43"
	)
	private Date updatedAt;

	@Schema(name = "tags")
	private Set<TagResponse> tags;
}

