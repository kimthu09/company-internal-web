package com.ciw.backend.payload.auth;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
	@Schema(name = "name", example = "user")
	@Length(min = 1, max = 200, message = Message.User.NAME_VALIDATE)
	private String name;

	@Schema(name = "email", example = "user@gmail.com")
	@Email(message = Message.EMAIL_VALIDATE)
	@NotEmpty(message = Message.EMAIL_VALIDATE)
	private String email;

	@Schema(name = "password", example = "123456")
	@Length(min = 6, max = 20, message = Message.PASSWORD_VALIDATE)
	private String password;
}
