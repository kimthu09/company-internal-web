package com.ciw.backend.payload.unit;

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
public class UnitFilter {
	@Schema(name = "name", example = "Tên phòng ban")
	@Length(max = 100, message = Message.Unit.UNIT_NAME_FILTER_VALIDATE)
	private String name;

	@Schema(name = "manager", example = "Tên trưởng phòng")
	@Length(max = 200, message = Message.User.NAME_FILTER_VALIDATE)
	private String manager;
}
