package com.ciw.backend.controller;

import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.unit.CreateUnitRequest;
import com.ciw.backend.payload.unit.SimpleUnitResponse;
import com.ciw.backend.payload.unit.UnitFilter;
import com.ciw.backend.payload.unit.UnitResponse;
import com.ciw.backend.service.UnitService;
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
@RequestMapping("/api/v1/unit")
@RequiredArgsConstructor
@Tag(
		name = "Unit"
)
@Validated
public class UnitController {
	private final UnitService unitService;

	@GetMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch units",
			description = "Fetch units from database by filter and paging"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<ListResponse<SimpleUnitResponse, UnitFilter>> getUnits(
			@Valid AppPageRequest page,
			@Valid UnitFilter filter) {
		return new ResponseEntity<>(unitService.getUnits(page, filter), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch detail unit",
			description = "Fetch detail unit from database"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<UnitResponse> getUnit(@PathVariable Long id) {
		return new ResponseEntity<>(unitService.getUnit(id), HttpStatus.OK);
	}

	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Create unit",
			description = "Create new unit"
	)
	@ApiResponse(
			responseCode = "201",
			description = "Http Status is 201 CREATED"
	)
	@PostMapping
	public ResponseEntity<UnitResponse> createUnit(
			@Valid @RequestBody CreateUnitRequest request
	) {
		return new ResponseEntity<>(unitService.createUnit(request), HttpStatus.CREATED);
	}
}
