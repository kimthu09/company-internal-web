package com.ciw.backend.controller;

import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.auth.AuthenticationRequest;
import com.ciw.backend.payload.auth.AuthenticationResponse;
import com.ciw.backend.payload.auth.EmailRequest;
import com.ciw.backend.payload.auth.ResetPasswordRequest;
import com.ciw.backend.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(
		name = "Auth"
)
@Validated
public class AuthenticationController {
	private final AuthenticationService authService;

	@Operation(
			summary = "Login",
			description = "Login to use system"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PostMapping("/authenticate")
	@PermitAll
	public ResponseEntity<AuthenticationResponse> authenticate(
			@Valid @RequestBody AuthenticationRequest request
	) {
		return ResponseEntity.ok(authService.authenticate(request));
	}

	@Operation(
			summary = "Send email to reset password",
			description = "Send email to reset password"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PostMapping("/reset_password")
	@PermitAll
	public ResponseEntity<SimpleResponse> sendEmailToResetPassword(
			@Valid @RequestBody EmailRequest request
	) {
		return ResponseEntity.ok(authService.sendEmailToResetPassword(request));
	}

	@Operation(
			summary = "Reset password",
			description = "Reset password by reset password token"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PostMapping("/reset_password/{token}")
	@PermitAll
	public ResponseEntity<SimpleResponse> resetPassword(
			@Valid @RequestBody ResetPasswordRequest request,
			@PathVariable String token) {
		return ResponseEntity.ok(authService.resetPassword(request, token));
	}
}
