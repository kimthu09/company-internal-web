package com.ciw.backend.payload;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class SimpleMapResponse<T> {
	private Map<String, T> data;
}
