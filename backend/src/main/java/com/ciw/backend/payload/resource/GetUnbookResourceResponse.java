package com.ciw.backend.payload.resource;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GetUnbookResourceResponse {
	@Schema(name = "day")
	private List<ResourceResponse> day;

	@Schema(name = "night")
	private List<ResourceResponse> night;
}
