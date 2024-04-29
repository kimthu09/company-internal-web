package com.ciw.backend.payload.resource;

import com.ciw.backend.constants.Message;
import com.ciw.backend.utils.validation.date.ValidDDMMYYYYFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GetUnbookResourceRequest {
	@Schema(
			name = "date",
			example = "12/12/2000"
	)
	@ValidDDMMYYYYFormat
	@NotNull(message = Message.Resource.MISSING_DATE)
	private String date;
}
