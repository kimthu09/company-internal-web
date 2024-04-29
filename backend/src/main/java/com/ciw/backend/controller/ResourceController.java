package com.ciw.backend.controller;

import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.MapResponseWithoutPage;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.resource.*;
import com.ciw.backend.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/resource")
@RequiredArgsConstructor
@Tag(
		name = "Resource"
)
public class ResourceController {
	private final ResourceService resourceService;

	@GetMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch resources",
			description = "Fetch resources from database by filter and paging"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<ListResponse<ResourceResponse, ResourceFilter>> getResources(
			@Valid AppPageRequest page,
			@Valid ResourceFilter filter) {
		return new ResponseEntity<>(resourceService.getResources(page, filter), HttpStatus.OK);
	}

	@PostMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Create resource",
			description = "Create new resource"
	)
	@ApiResponse(
			responseCode = "201",
			description = "Http Status is 201 CREATED"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<ResourceResponse> createResource(
			@Valid @RequestBody CreateResourceRequest request
	) {
		return new ResponseEntity<>(resourceService.createResource(request), HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Update resource",
			description = "Update resource"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<ResourceResponse> updateResource(
			@PathVariable Long id,
			@Valid @RequestBody UpdateResourceRequest request) {
		return new ResponseEntity<>(resourceService.updateResource(id, request), HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Delete resource",
			description = "Delete resource"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<SimpleResponse> deleteResource(
			@PathVariable Long id) {
		return new ResponseEntity<>(resourceService.deleteResource(id), HttpStatus.OK);
	}

	@GetMapping("/books")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch resource books",
			description = "Fetch resource books from database by filter"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<MapResponseWithoutPage<ResourceCalendarDayResponse, ResourceCalendarFilter>> getResourceBooks(
			@Valid ResourceCalendarFilter filter) {
		return new ResponseEntity<>(resourceService.getResourceCalendar(filter), HttpStatus.OK);
	}

	@GetMapping("/books/day/unbook")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch unbook resource by date",
			description = "Fetch unbook resource from database by date"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<GetUnbookResourceResponse> getUnbookResourceInSpecificDate(
			@Valid GetUnbookResourceRequest request) {
		return new ResponseEntity<>(resourceService.getUnbookResource(request), HttpStatus.OK);
	}

	@PostMapping("/books/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Book resource",
			description = "Book resource"
	)
	@ApiResponse(
			responseCode = "201",
			description = "Http Status is 201 CREATED"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<SimpleResponse> bookResource(
			@PathVariable Long id,
			@Valid @RequestBody BookResourceRequest request) {
		return new ResponseEntity<>(resourceService.bookResource(id, request), HttpStatus.OK);
	}

	@DeleteMapping("/books/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Delete book resource",
			description = "Delete book resource"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<SimpleResponse> deleteBookMeetingRoom(
			@PathVariable Long id) {
		return new ResponseEntity<>(resourceService.deleteResourceCalendar(id), HttpStatus.OK);
	}
}
