package com.ciw.backend.payload.tag;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TagResponse {
	@Schema(
			name = "id",
			example = "1"
	)
	private Long id;
	@Schema(
			name = "name",
			example = "Sự kiện"
	)
	private String name;
	@Schema(
			name = "numberPost",
			example = "0"
	)
	private int numberPost;
}

