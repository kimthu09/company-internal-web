package com.ciw.backend.payload;

import com.ciw.backend.payload.page.AppPageResponse;
import com.fasterxml.jackson.annotation.JsonProperty;
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
public class ListResponse<T, F> {
	@Schema(name = "data")
	@JsonProperty("data")
	private List<T> data;

	@Schema(name = "page")
	@JsonProperty("page")
	private AppPageResponse appPageResponse;

	@Schema(name = "filter")
	@JsonProperty("filter")
	private F filter;
}
