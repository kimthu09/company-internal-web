package com.ciw.backend.payload.unit;

import com.ciw.backend.payload.feature.FeatureResponse;
import com.ciw.backend.payload.user.SimpleUserResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnitResponse {
	@Schema(
			name = "id",
			example = "0"
	)
	private Long id;

	@Schema(
			name = "name",
			example = "Tên phòng ban"
	)
	private String name;

	@Schema(name = "manager")
	private SimpleUserResponse manager;

	@Schema(name = "staffs")
	private List<SimpleUserResponse> staffs;

	@Schema(name = "features")
	private List<FeatureResponse> features;

	@Schema(
			name = "numberStaffs",
			example = "1"
	)
	private int numberStaffs = 0;
}
