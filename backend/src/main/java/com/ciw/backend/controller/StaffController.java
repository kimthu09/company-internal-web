package com.ciw.backend.controller;

import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.staff.CreateStaffRequest;
import com.ciw.backend.payload.staff.StaffFilter;
import com.ciw.backend.payload.staff.StaffResponse;
import com.ciw.backend.payload.staff.UpdateStaffRequest;
import com.ciw.backend.service.StaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
			description = "Note:\n+" +
						  "- Fetch all user are not deleted and not admin (admin@gmail.com)"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<ListResponse<StaffResponse, StaffFilter>> getUsers(
			@Valid AppPageRequest page,
			@Valid StaffFilter filter) {
		return new ResponseEntity<>(staffService.getUsers(page, filter), HttpStatus.OK);
	}

	@GetMapping("/all")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch all staffs",
			description = "Note:\n+" +
						  "- Fetch all user are not deleted and deleted if current user is admin\n" +
						  "- Else fetch all user except admin"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<ListResponse<StaffResponse, StaffFilter>> getListUsers(
			@Valid AppPageRequest page,
			@Valid StaffFilter filter) {
		return new ResponseEntity<>(staffService.getListUsers(page, filter), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch detail staff",
			description = "Note:\n" +
						  "- Can not reach admin's info"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<StaffResponse> getUser(@PathVariable Long id) {
		return new ResponseEntity<>(staffService.getUser(id), HttpStatus.OK);
	}

	@PostMapping
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
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<StaffResponse> createStaff(
			@Valid @RequestBody CreateStaffRequest request
	) {
		return new ResponseEntity<>(staffService.createStaff(request), HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Update staff",
			description = "Note:\n" +
						  "- Can not update admin's info"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<StaffResponse> updateStaff(
			@PathVariable Long id,
			@Valid @RequestBody UpdateStaffRequest request
	) {
		return new ResponseEntity<>(staffService.updateStaff(id, request), HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Delete staff",
			description = "Note:\n" +
						  "- Can not delete admin"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<SimpleResponse> deleteStaff(
			@PathVariable Long id
	) {
		return new ResponseEntity<>(staffService.deleteStaff(id), HttpStatus.OK);
	}
}
