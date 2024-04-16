package com.ciw.backend.controller;

import com.ciw.backend.payload.file.FileLinkResponse;
import com.ciw.backend.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/file")
@RequiredArgsConstructor
@Tag(
		name = "File"
)
public class FileController {
	private final FileService fileService;

	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Upload file",
			description = "Upload file for application. Only allows: Image (.png, .jpg, .jpeg, .gif, .svg), Document (.png, .doc, .docx, .csv, .xls)"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PostMapping
	public ResponseEntity<FileLinkResponse> upload(@RequestParam("file") MultipartFile multipartFile) {
		return new ResponseEntity<>(fileService.upload(multipartFile), HttpStatus.OK);
	}
}
