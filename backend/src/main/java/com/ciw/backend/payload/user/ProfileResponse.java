package com.ciw.backend.payload.user;

import com.ciw.backend.payload.unit.SimpleUnitWithFeatureResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
	@Schema(
			name = "id",
			example = "1"
	)
	private Long id;

	@Schema(
			name = "email",
			example = "admin@gmail.com"
	)
	private String email;

	@Schema(
			name = "name",
			example = "Nguyễn Văn A"
	)
	private String name;

	@Schema(name = "unit")
	private SimpleUnitWithFeatureResponse unit;
}
