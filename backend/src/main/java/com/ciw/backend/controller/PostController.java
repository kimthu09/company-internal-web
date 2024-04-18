package com.ciw.backend.controller;

import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.post.*;
import com.ciw.backend.service.PostService;
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
@RequestMapping("/api/v1/post")
@RequiredArgsConstructor
@Tag(
		name = "Post"
)
@Validated
public class PostController {
	private final PostService postService;

	@GetMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch posts",
			description = "Fetch posts from database by filter and paging"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<ListResponse<SimplePostResponse, PostFilter>> getPosts(
			@Valid AppPageRequest page,
			@Valid PostFilter filter) {
		return new ResponseEntity<>(postService.getPosts(page, filter), HttpStatus.OK);
	}

	@GetMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch detail post",
			description = "Fetch detail post from database by id"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<PostResponse> seeDetailPost(@PathVariable Long id) {
		return new ResponseEntity<>(postService.getPost(id), HttpStatus.OK);
	}

	@PostMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Create post",
			description = "Create new post"
	)
	@ApiResponse(
			responseCode = "201",
			description = "Http Status is 201 CREATED"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN', 'POST')")
	public ResponseEntity<PostResponse> createPost(
			@Valid @RequestBody CreatePostRequest request
	) {
		return new ResponseEntity<>(postService.createPost(request), HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Update post",
			description = "Update post"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN', 'POST')")
	public ResponseEntity<PostResponse> updatePost(
			@PathVariable Long id,
			@Valid @RequestBody UpdatePostRequest request) {
		return new ResponseEntity<>(postService.updatePost(id, request), HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Delete post",
			description = "Delete one post. When deleted, post will be excluded from tag has its"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN', 'POST')")
	public ResponseEntity<SimpleResponse> deletePost(
			@PathVariable Long id
	) {
		return new ResponseEntity<>(postService.deletePost(id), HttpStatus.OK);
	}
}
