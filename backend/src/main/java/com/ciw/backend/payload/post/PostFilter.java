package com.ciw.backend.payload.post;

import com.ciw.backend.constants.Message;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostFilter {
	@Schema(
			name = "title",
			example = "Tiêu đề bài post"
	)
	@Length(
			max = 100,
			message = Message.Post.POST_TITLE_FILTER_VALIDATE
	)
	private String title;

	@Schema(
			name = "updatedAtFrom",
			example = "2024-04-16 05:20:42"
	)
	private String updatedAtFrom;

	@Schema(
			name = "updatedAtTo",
			example = "2024-04-16 05:20:42"
	)
	private String updatedAtTo;

	@Schema(
			name = "tags",
			example = "[\"1\", \"2\"]"
	)
	@JsonProperty("tags")
	private List<String> tags;
}
