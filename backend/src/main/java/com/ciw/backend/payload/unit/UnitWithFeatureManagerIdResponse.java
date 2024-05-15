package com.ciw.backend.payload.unit;

import com.ciw.backend.payload.feature.SimpleFeatureResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UnitWithFeatureManagerIdResponse {
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

	@Schema(name = "features")
	private List<SimpleFeatureResponse> features;

	@Schema(name = "managerId")
	private Long managerId;
}
