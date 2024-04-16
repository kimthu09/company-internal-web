package com.ciw.backend.payload.file;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileLinkResponse {
	@Schema(name = "file",
			example = "https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/image_bc846e12-891b-4e1e-9f40-61ac4342705e.png?alt=media")
	private String file;
}
