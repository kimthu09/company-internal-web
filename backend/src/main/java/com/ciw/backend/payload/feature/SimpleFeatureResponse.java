package com.ciw.backend.payload.feature;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimpleFeatureResponse {
	@Schema(
			name = "id",
			example = "1"
	)
	private Long id;

	@Schema(
			name = "name",
			example = "Tên chức năng"
	)
	private String name;
}
