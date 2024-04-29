package com.ciw.backend.payload.unit;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UnitWithIdAndNameResponse {
	@Schema(
			name = "id",
			example = "1"
	)
	private Long id;

	@Schema(
			name = "name",
			example = "Tên phòng ban"
	)
	private String name;
}
