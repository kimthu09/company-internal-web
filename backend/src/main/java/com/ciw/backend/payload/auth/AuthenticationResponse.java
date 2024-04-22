package com.ciw.backend.payload.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
	@Schema(name = "token",
			example = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTcxMjcxOTUzNCwiZXhwIjoxNzEyNzIwOTc0fQ.UZHm76iYy9VkoDhk4OZ2PXKiLJ4rREs2NJU63BwPkeM")
	private String token;
}
