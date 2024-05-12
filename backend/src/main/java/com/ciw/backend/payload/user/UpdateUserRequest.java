package com.ciw.backend.payload.user;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class UpdateUserRequest {
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
}
