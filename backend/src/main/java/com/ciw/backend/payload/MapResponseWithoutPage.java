package com.ciw.backend.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MapResponseWithoutPage<T, F> {
	@Schema(name = "data")
	@JsonProperty("data")
	private Map<String, T> data;

	@Schema(name = "filter")
	@JsonProperty("filter")
	private F filter;
}
