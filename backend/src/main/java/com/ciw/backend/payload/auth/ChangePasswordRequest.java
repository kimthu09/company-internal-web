package com.ciw.backend.payload.auth;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
	@Schema(name = "oldPassword", example = "123456")
	@Length(min = 6, max = 20, message = Message.PASSWORD_VALIDATE)
	private String oldPassword;

	@Schema(name = "newPassword", example = "123456")
	@Length(min = 6, max = 20, message = Message.PASSWORD_VALIDATE)
	private String newPassword;
}
