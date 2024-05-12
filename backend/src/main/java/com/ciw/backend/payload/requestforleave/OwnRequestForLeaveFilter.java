package com.ciw.backend.payload.requestforleave;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class OwnRequestForLeaveFilter {
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
