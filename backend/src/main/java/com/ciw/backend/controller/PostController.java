package com.ciw.backend.controller;

import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.post.CreatePostRequest;
import com.ciw.backend.payload.post.PostFilter;
import com.ciw.backend.payload.post.PostResponse;
import com.ciw.backend.payload.post.SimplePostResponse;
import com.ciw.backend.service.PostService;
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
@RequestMapping("/api/v1/post")
@RequiredArgsConstructor
@Tag(
		name = "Post"
)
@Validated
public class PostController {
	private final PostService postService;

	@GetMapping
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
	@Operation(
			summary = "Fetch detail post",
			description = "Fetch detail post from database by id"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<PostResponse> seeDetailPost(@PathVariable Long id) {
		return new ResponseEntity<>(postService.seeDetailPost(id), HttpStatus.OK);
	}

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
	@PostMapping
	public ResponseEntity<PostResponse> createPost(
			@Valid @RequestBody CreatePostRequest request
	) {
		return new ResponseEntity<>(postService.createPost(request), HttpStatus.CREATED);
	}

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
	@DeleteMapping("/{id}")
	public ResponseEntity<SimpleResponse> deletePost(
			@PathVariable Long id
	) {
		return new ResponseEntity<>(postService.deletePost(id), HttpStatus.OK);
	}
}
