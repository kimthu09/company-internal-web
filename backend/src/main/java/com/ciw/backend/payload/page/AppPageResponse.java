package com.ciw.backend.payload.page;

import com.ciw.backend.constants.ApplicationConst;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppPageResponse {
	@Schema(name = "index", example = "1")
	private int index;

	@Schema(name = "limit", example = "10")
	private int limit;

	@Schema(name = "totalElements", example = "13")
	private long totalElements;

	@Schema(name = "totalPages", example = "2")
	private long totalPages;
}
