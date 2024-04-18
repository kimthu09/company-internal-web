package com.ciw.backend.payload.auth;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetPasswordRequest {
	@Schema(name = "password", example = "123456")
	@Length(min = 6, max = 20, message = Message.PASSWORD_VALIDATE)
	@NotNull(message = Message.PASSWORD_VALIDATE)
	private String password;
}
