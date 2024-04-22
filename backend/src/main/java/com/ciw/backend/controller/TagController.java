package com.ciw.backend.controller;

import com.ciw.backend.payload.SimpleListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.tag.CreateTagRequest;
import com.ciw.backend.payload.tag.TagResponse;
import com.ciw.backend.payload.tag.UpdateTagRequest;
import com.ciw.backend.service.TagService;
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
@RequestMapping("/api/v1/tag")
@RequiredArgsConstructor
@Tag(
		name = "Tag"
)
@Validated
public class TagController {
	private final TagService tagService;

	@GetMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch all tag",
			description = "Fetch all tag to filter post"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<SimpleListResponse<TagResponse>> fetchAllTag() {
		return new ResponseEntity<>(tagService.fetchAllTag(), HttpStatus.OK);
	}

	@PostMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Create tag",
			description = "Create new tag for post"
	)
	@ApiResponse(
			responseCode = "201",
			description = "Http Status is 201 CREATED"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN', 'POST')")
	public ResponseEntity<TagResponse> createTag(
			@Valid @RequestBody CreateTagRequest request
	) {
		return new ResponseEntity<>(tagService.createTag(request), HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Update tag",
			description = "Update tag's information"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN', 'POST')")
	public ResponseEntity<TagResponse> updateTag(
			@PathVariable Long id,
			@Valid @RequestBody UpdateTagRequest request
	) {
		return new ResponseEntity<>(tagService.updateTag(id, request), HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Delete tag",
			description = "Delete one tag. When deleted, tag will be excluded from post has its"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN', 'POST')")
	public ResponseEntity<SimpleResponse> deleteTag(
			@PathVariable Long id
	) {
		return new ResponseEntity<>(tagService.deleteTag(id), HttpStatus.OK);
	}
}
