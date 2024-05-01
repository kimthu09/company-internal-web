package com.ciw.backend.payload;

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
public class ListResponseWithoutPage<T, F> {
	@Schema(name = "data")
	@JsonProperty("data")
	private List<T> data;

	@Schema(name = "filter")
	@JsonProperty("filter")
	private F filter;
}
