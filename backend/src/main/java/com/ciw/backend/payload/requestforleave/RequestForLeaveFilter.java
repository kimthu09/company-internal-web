package com.ciw.backend.payload.requestforleave;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
public class RequestForLeaveFilter {
	@Schema(
			name = "units",
			example = "[1, 2]"
	)
	@JsonProperty("units")
	private List<Long> units;

	@Schema(
			name = "users",
			example = "[1, 2]"
	)
	@JsonProperty("users")
	private List<Long> users;

	@Schema(
			name = "dateFrom",
			example = "16/05/2024"
	)
	private String dateFrom;

	@Schema(
			name = "dateTo",
			example = "16/05/2024"
	)
	private String dateTo;

	@Schema(
			name = "isRejected",
			example = "true"
	)
	private Boolean isRejected;

	@Schema(
			name = "isApproved",
			example = "true"
	)
	private Boolean isApproved;

	@Schema(
			name = "isAccepted",
			example = "true"
	)
	private Boolean isAccepted;
}
