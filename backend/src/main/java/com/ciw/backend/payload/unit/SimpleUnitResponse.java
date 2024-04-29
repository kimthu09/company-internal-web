package com.ciw.backend.payload.unit;

import com.ciw.backend.payload.user.SimpleUserResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SimpleUnitResponse {
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

	@Schema(name = "manager")
	private SimpleUserResponse manager;

	@Schema(
			name = "numberStaffs",
			example = "1"
	)
	private int numberStaffs = 0;
}
