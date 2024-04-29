package com.ciw.backend.payload.user;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.constants.Message;
import com.ciw.backend.utils.validation.date.ValidDDMMYYYYFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class UpdateUserRequest {
	@Schema(
			name = "name",
			example = "user"
	)
	@Length(
			min = 1,
			max = 200,
			message = Message.User.NAME_VALIDATE
	)
	private String name;

	@Schema(
			name = "phone",
			example = "0123456789"
	)
	@Pattern(
			regexp = "\\d{10,11}",
			message = Message.User.PHONE_VALIDATE
	)
	private String phone;

	@Schema(
			name = "dob",
			example = "12/12/2000"
	)
	@ValidDDMMYYYYFormat(message = Message.User.DOB_VALIDATE)
	private String dob;

	@Schema(
			name = "address",
			example = "TPHCM"
	)
	@Length(
			min = 1,
			max = 50,
			message = Message.User.ADDRESS_VALIDATE
	)
	private String address;

	@Schema(
			name = "image",
			example = ApplicationConst.DEFAULT_AVATAR
	)
	private String image;

	@Schema(
			name = "male",
			example = "true"
	)
	private Boolean male;

	@Schema(
			name = "unit",
			example = "1"
	)
	private Long unit;
}
