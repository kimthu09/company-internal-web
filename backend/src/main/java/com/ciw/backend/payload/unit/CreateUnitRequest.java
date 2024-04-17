package com.ciw.backend.payload.unit;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUnitRequest {
	@Schema(name = "name", example = "Tên phòng ban")
	@Length(min = 1, max = 100, message = Message.Unit.UNIT_NAME_VALIDATE)
	private String name;

	@Schema(name = "features", example = "[0, 1]")
	private List<Long> features;
}
