package com.ciw.backend.payload.resource;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResourceResponse {
	@Schema(name = "id", example = "1")
	private Long id;

	@Schema(name = "name", example = "Micro 1")
	private String name;
}
