package com.ciw.backend.controller;

import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.requestforleave.CreateRequestForLeaveRequest;
import com.ciw.backend.payload.requestforleave.OwnRequestForLeaveFilter;
import com.ciw.backend.payload.requestforleave.RequestForLeaveFilter;
import com.ciw.backend.payload.requestforleave.RequestForLeaveResponse;
import com.ciw.backend.service.RequestForLeaveService;
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
@RequestMapping("/api/v1/requestForLeave")
@RequiredArgsConstructor
@Tag(
		name = "RequestForLeave"
)
@Validated
public class RequestForLeaveController {
	private final RequestForLeaveService requestForLeaveService;

	@GetMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch requests for leave",
			description = "Note:\n" +
						  "- If user is manager:\n" +
						  "-- The units in filter will not be effected\n" +
						  "-- Get the requests for leave of user's unit\n" +
						  "- If user is admin or has feature staff manager: this API works normally"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	//Set feature in function already
	public ResponseEntity<ListResponse<RequestForLeaveResponse, RequestForLeaveFilter>> getRequestForLeaves(
			@Valid AppPageRequest page,
			@Valid RequestForLeaveFilter filter) {
		return new ResponseEntity<>(requestForLeaveService.getRequestForLeaves(page, filter), HttpStatus.OK);
	}

	@GetMapping("/mine")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch requests for leave of current user",
			description = "Fetch the request for leave for the current user"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	//Set feature in function already
	public ResponseEntity<ListResponse<RequestForLeaveResponse, OwnRequestForLeaveFilter>> getOwnRequestForLeaves(
			@Valid AppPageRequest page,
			@Valid OwnRequestForLeaveFilter filter) {
		return new ResponseEntity<>(requestForLeaveService.getOwnRequestForLeaves(page, filter), HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Delete request for leave",
			description = "Note:\n" +
						  "- Only creator can delete their request for leave\n" +
						  "- Can only delete ones has not been approved\n" +
						  "- After deleting, the system will create new notification to the user delete request for leave"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	//Set feature in function already
	public ResponseEntity<SimpleResponse> deleteRequestForLeave(
			@PathVariable Long id) {
		return new ResponseEntity<>(requestForLeaveService.deleteRequestForLeave(id), HttpStatus.OK);
	}

	@PostMapping("/{id}/reject")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Reject request for leave",
			description = "Note:\n" +
						  "- Only manager, admin, those has feature staff manager can reject other request for leave\n" +
						  "- Can only reject ones has not been approved\n" +
						  "- After rejecting, the system will create new notification to the user create request for leave"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	//Set feature in function already
	public ResponseEntity<SimpleResponse> rejectRequestForLeave(
			@PathVariable Long id) {
		return new ResponseEntity<>(requestForLeaveService.rejectRequestForLeave(id), HttpStatus.OK);
	}

	@PostMapping("/{id}/pass")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Pass request for leave",
			description = "Note:\n" +
						  "- Only manager, admin can accepted request for leave\n" +
						  "- Only those has feature staff manager, admin can approved request for leave\n" +
						  "- Can only approve ones has been accepted. Except: when admin pass, " +
						  "the request for leave can be approved and accepted at the same time\n" +
						  "- After changing status, the system will create new notification to the user create request for leave"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	//Set feature in function already
	public ResponseEntity<SimpleResponse> passRequestForLeave(
			@PathVariable Long id) {
		return new ResponseEntity<>(requestForLeaveService.passRequestForLeave(id), HttpStatus.OK);
	}

	@PostMapping()
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Create new request for leave",
			description = "Note:\n" +
						  "- Everyone can create new request for leave\n" +
						  "- Users can not create two requests for leave with the same date and shift type\n" +
						  "- After creating, the system will create new notification to the user create request for leave\n" +
						  "- Already check fromDate, toDate, fromShiftType, toShiftType"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<RequestForLeaveResponse> createRequestForLeave(
			@Valid @RequestBody CreateRequestForLeaveRequest request) {
		return new ResponseEntity<>(requestForLeaveService.createRequestForLeave(request), HttpStatus.OK);
	}
}
