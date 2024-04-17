package com.ciw.backend.controller;

import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.user.CreateUserRequest;
import com.ciw.backend.payload.user.UserFilter;
import com.ciw.backend.payload.user.UserResponse;
import com.ciw.backend.service.StaffService;
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
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
@Tag(
		name = "Staff"
)
@Validated
public class StaffController {
	private final StaffService staffService;

	@GetMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch staffs",
			description = "Fetch staffs from database by filter and paging"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<ListResponse<UserResponse, UserFilter>> getUsers(
			@Valid AppPageRequest page,
			@Valid UserFilter filter) {
		return new ResponseEntity<>(staffService.getUsers(page, filter), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch detail staff",
			description = "Fetch detail staff from database"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
		return new ResponseEntity<>(staffService.getUser(id), HttpStatus.OK);
	}

	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Create staff",
			description = "Create new staff"
	)
	@ApiResponse(
			responseCode = "201",
			description = "Http Status is 201 CREATED"
	)
	@PostMapping
	public ResponseEntity<UserResponse> createUnit(
			@Valid @RequestBody CreateUserRequest request
	) {
		return new ResponseEntity<>(staffService.createUser(request), HttpStatus.CREATED);
	}
}
