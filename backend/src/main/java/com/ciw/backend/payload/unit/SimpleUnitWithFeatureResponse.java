package com.ciw.backend.payload.unit;

import com.ciw.backend.payload.feature.FeatureResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SimpleUnitWithFeatureResponse {
	@Schema(name = "id", example = "1")
	private Long id;

	@Schema(name = "name", example = "Tên phòng ban")
	private String name;

	@Schema(name = "features")
	private List<FeatureResponse> features;
}
