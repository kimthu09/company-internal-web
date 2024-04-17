package com.ciw.backend.controller;

import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.auth.ChangePasswordRequest;
import com.ciw.backend.payload.user.ProfileResponse;
import com.ciw.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@Tag(
		name = "User"
)
@Validated
public class UserController {
	private final UserService userService;
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Change password REST API",
			description = "Change password for user's account"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PostMapping("/password")
	public ResponseEntity<SimpleResponse> changePassword(
			@Valid @RequestBody ChangePasswordRequest request
	){
		return new ResponseEntity<>(userService.changePassword(request), HttpStatus.OK);
	}

	@GetMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "See profile",
			description = "See user's simple info and features"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<ProfileResponse> seeProfile() {
		return new ResponseEntity<>(userService.seeProfile(), HttpStatus.OK);
	}
}
