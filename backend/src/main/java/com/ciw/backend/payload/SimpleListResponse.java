package com.ciw.backend.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class SimpleListResponse<T> {
	@Schema(name = "data")
	private List<T> data;
}
