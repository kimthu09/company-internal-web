package com.ciw.backend.payload.auth;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRequest {
	@Schema(
			name = "email",
			example = "admin@gmail.com"
	)
	@Email(message = Message.EMAIL_VALIDATE)
	@NotEmpty(message = Message.EMAIL_VALIDATE)
	@NotNull(message = Message.EMAIL_VALIDATE)
	private String email;

	@Schema(
			name = "password",
			example = "123456"
	)
	@Length(
			min = 6,
			max = 20,
			message = Message.PASSWORD_VALIDATE
	)
	@NotNull(message = Message.PASSWORD_VALIDATE)
	private String password;
}
