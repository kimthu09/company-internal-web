package com.ciw.backend.controller;

import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.notification.*;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.service.NotificationService;
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
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
@Tag(
		name = "Notification"
)
public class NotificationController {
	private final NotificationService notificationService;

	@GetMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch notifications",
			description = "Fetch notifications from database by filter and paging"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<ListResponse<NotificationResponse, NotificationFilter>> getNotifications(
			@Valid AppPageRequest page,
			@Valid NotificationFilter filter) {
		return new ResponseEntity<>(notificationService.getNotifications(page, filter, false), HttpStatus.OK);
	}

	@GetMapping("/make_seen")
	@SecurityRequirement(
			name = "Bearer Authentication and seen"
	)
	@Operation(
			summary = "Fetch notifications",
			description = "Fetch notifications from database by filter and paging"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<ListResponse<NotificationResponse, NotificationFilter>> getNotificationsAndMakeItSeen(
			@Valid AppPageRequest page,
			@Valid NotificationFilter filter) {
		return new ResponseEntity<>(notificationService.getNotifications(page, filter, true), HttpStatus.OK);
	}

	@PostMapping()
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Create notifications for list staff",
			description = "Create new notification for specific active staff." +
						  "Note: if staff is not active, the api will send successful response " +
						  "and not sending notification instead of returning error"
	)
	@ApiResponse(
			responseCode = "201",
			description = "Http Status is 201 CREATED"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN', 'NOTI')")
	public ResponseEntity<SimpleResponse> sendNotification(@Valid CreateNotificationRequest request) {
		return new ResponseEntity<>(notificationService.sendNotification(request), HttpStatus.OK);
	}

	@PostMapping("/{id}/seen")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "See notification",
			description = "Make notification seen in database"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<NotificationResponse> seeNotification(@PathVariable Long id) {
		return new ResponseEntity<>(notificationService.seeNotification(id), HttpStatus.OK);
	}

	@PostMapping("/seen")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "See all notifications",
			description = "Make all notification of current user seen in database"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<SimpleResponse> seeAllNotifications() {
		return new ResponseEntity<>(notificationService.seeAllNotification(), HttpStatus.OK);
	}

	@GetMapping("/number_unseen")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Get number of current user's unseen notifications",
			description = "Get number of current user's unseen notifications"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<NumberNotificationNotSeenResponse> getNumberUnseenNotification() {
		return new ResponseEntity<>(notificationService.getNumberUnseenNotification(), HttpStatus.OK);
	}

	@GetMapping("/unseen")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Get unseen notifications of current user",
			description = "Get unseen notifications of current user"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<SimpleListResponse<NotificationResponse>> getUnseenNotification() {
		return new ResponseEntity<>(notificationService.getUnseenNotifications(), HttpStatus.OK);
	}
}
