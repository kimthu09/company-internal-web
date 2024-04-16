package com.ciw.backend.payload.tag;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NameTagRequest {
	@Schema(name = "name", example = "Sự kiện")
	@Length(min = 1, max = 50, message = Message.Tag.TAG_NAME_INVALID)
	private String name;
}
