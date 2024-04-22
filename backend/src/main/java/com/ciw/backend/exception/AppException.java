package com.ciw.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
@Getter
public class AppException extends RuntimeException {
	private final HttpStatus status;
	private final String message;
}
