package com.ciw.backend.payload.resource;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResourceFilter {
	@Schema(
			name = "name",
			example = "Micro 1"
	)
	@Length(
			min = 1,
			max = 50,
			message = Message.Resource.NAME_VALIDATE
	)
	private String name;
}