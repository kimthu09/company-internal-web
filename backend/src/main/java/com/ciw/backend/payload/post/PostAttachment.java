package com.ciw.backend.payload.post;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostAttachment implements Serializable {
	@Schema(
			name = "name",
			example = "Tên tài liệu"
	)
	private String name;
	@Schema(
			name = "link",
			example = "https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Ch6%20-%20Cost%20-%20SV.pdf?alt=media"
	)
	private String link;
}
