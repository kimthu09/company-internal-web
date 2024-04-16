package com.ciw.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/hello")
@Tag(
		name = "Category"
)
public class Demo {
	@GetMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@PreAuthorize("hasRole('ROLE_USER')")
	@Operation(
			summary = "Add category REST API",
			description = "Add category Rest API is used to save category into database"
	)
	@ApiResponse(
			responseCode = "201",
			description = "Http Status is 201 CREATED"
	)
	public ResponseEntity<String> sayHello(){
		return ResponseEntity.ok("Say hi");
	}
}
