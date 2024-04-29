package com.ciw.backend.payload.user;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserFilter {
	@Schema(
			name = "name",
			example = "Tên người dùng"
	)
	@Length(
			max = 200,
			message = Message.User.NAME_FILTER_VALIDATE
	)
	private String name;

	@Schema(
			name = "email",
			example = "a@gmail.com"
	)
	private String email;

	@Schema(
			name = "phone",
			example = "0123456789"
	)
	@Length(
			max = 11,
			message = Message.User.PHONE_FILTER_VALIDATE
	)
	private String phone;

	@Schema(
			name = "unit",
			example = "Tên phòng ban"
	)
	@Length(
			max = 100,
			message = Message.Unit.UNIT_NAME_FILTER_VALIDATE
	)
	private String unit;

	@Schema(
			name = "male",
			example = "true"
	)
	private Boolean male;

	@Schema(
			name = "monthDOB",
			example = "1"
	)
	@Min(
			value = 1,
			message = Message.User.DOB_VALIDATE
	)
	@Max(
			value = 12,
			message = Message.User.DOB_VALIDATE
	)
	private Integer monthDOB;

	@Schema(
			name = "yearDOB",
			example = "1900"
	)
	@Min(
			value = 1900,
			message = Message.User.DOB_VALIDATE
	)
	@Max(
			value = 2024,
			message = Message.User.DOB_VALIDATE
	)
	private Integer yearDOB;
}