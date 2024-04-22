package com.ciw.backend.payload.resource;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class CreateResourceRequest {
	@Schema(name = "name", example = "Micro 1")
	@Length(min = 1, max = 50, message = Message.Resource.NAME_VALIDATE)
	@NotNull(message = Message.Resource.NAME_VALIDATE)
	private String name;
}
