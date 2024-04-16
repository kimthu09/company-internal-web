package com.ciw.backend.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SimpleResponse {
	@Schema(name = "data", example = "true")
	private boolean data;
	public SimpleResponse(){
		data = true;
	}
}
