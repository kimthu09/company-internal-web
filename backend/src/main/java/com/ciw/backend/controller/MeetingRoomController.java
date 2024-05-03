package com.ciw.backend.controller;

import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.ListResponseWithoutPage;
import com.ciw.backend.payload.SimpleListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.meetingroom.*;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.service.MeetingRoomService;
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
@RequestMapping("/api/v1/meeting_room")
@RequiredArgsConstructor
@Tag(
		name = "Meeting Room"
)
public class MeetingRoomController {
	private final MeetingRoomService meetingRoomService;

	@GetMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch meeting rooms",
			description = "Fetch meeting rooms from database by filter and paging"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<ListResponse<MeetingRoomResponse, MeetingRoomFilter>> getMeetingRooms(
			@Valid AppPageRequest page,
			@Valid MeetingRoomFilter filter) {
		return new ResponseEntity<>(meetingRoomService.getMeetingRooms(page, filter), HttpStatus.OK);
	}

	@PostMapping
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Create meeting room",
			description = "Create new meeting room"
	)
	@ApiResponse(
			responseCode = "201",
			description = "Http Status is 201 CREATED"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<MeetingRoomResponse> createMeetingRoom(
			@Valid @RequestBody CreateMeetingRoomRequest request
	) {
		return new ResponseEntity<>(meetingRoomService.createMeetingRoom(request), HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Update meeting room",
			description = "Update meeting room"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<MeetingRoomResponse> updateMeetingRoom(
			@PathVariable Long id,
			@Valid @RequestBody UpdateMeetingRoomRequest request) {
		return new ResponseEntity<>(meetingRoomService.updateMeetingRoom(id, request), HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Delete meeting room",
			description = "Delete meeting room"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	public ResponseEntity<SimpleResponse> deleteMeetingRoom(
			@PathVariable Long id) {
		return new ResponseEntity<>(meetingRoomService.deleteMeetingRoom(id), HttpStatus.OK);
	}

	@GetMapping("/books")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch meeting room books",
			description = "Fetch meeting room books from database by filter"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<ListResponseWithoutPage<MeetingRoomCalendarDayResponse, MeetingRoomCalendarFilter>> getMeetingRoomBooks(
			@Valid MeetingRoomCalendarFilter filter) {
		return new ResponseEntity<>(meetingRoomService.getMeetingRoomCalendar(filter), HttpStatus.OK);
	}

	@GetMapping("/books/personal")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch personal meeting room books",
			description = "Fetch personal meeting room books from database by filter"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<ListResponseWithoutPage<MeetingRoomCalendarDayResponse, PersonalMeetingRoomCalendarFilter>> getPersonalMeetingRoomBooks(
			@Valid PersonalMeetingRoomCalendarFilter filter) {
		return new ResponseEntity<>(meetingRoomService.getPersonalMeetingRoomCalendar(filter), HttpStatus.OK);
	}

	@GetMapping("/books/day/unbook")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch unbook meeting room by date",
			description = "Fetch unbook meeting room from database by date"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<GetUnbookMeetingRoomResponse> getUnbookMeetingRoomInSpecificDate(
			@Valid GetUnbookMeetingRoomRequest request) {
		return new ResponseEntity<>(meetingRoomService.getUnbookMeetingRoom(request), HttpStatus.OK);
	}

	@PostMapping("/books/day_range/unbook")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Fetch unbook meeting room by date range",
			description = "Fetch unbook meeting room from database by date range"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	public ResponseEntity<SimpleListResponse<MeetingRoomResponse>> getUnbookMeetingRoomInDateRange(
			@Valid @RequestBody GetUnbookMeetingRoomDateRangeRequest request) {
		return new ResponseEntity<>(meetingRoomService.getUnbookMeetingRoomByDateRange(request), HttpStatus.OK);
	}

	@PostMapping("/books/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Book meeting room",
			description = "Book meeting room"
	)
	@ApiResponse(
			responseCode = "201",
			description = "Http Status is 201 CREATED"
	)
	public ResponseEntity<SimpleResponse> bookMeetingRoom(
			@PathVariable Long id,
			@Valid @RequestBody BookMeetingRoomRequest request) {
		return new ResponseEntity<>(meetingRoomService.bookMeetingRoom(id, request), HttpStatus.OK);
	}

	@DeleteMapping("/books/{id}")
	@SecurityRequirement(
			name = "Bearer Authentication"
	)
	@Operation(
			summary = "Delete meeting room book",
			description = "Delete meeting room book.\n" +
						  "Note:\n" +
						  "- Admin can delete all meeting room book\n" +
						  "- Normal user just can delete their book"
	)
	@ApiResponse(
			responseCode = "200",
			description = "Http Status is 200 OK"
	)
	//Set feature in function already
	public ResponseEntity<SimpleResponse> deleteBookMeetingRoom(
			@PathVariable Long id) {
		return new ResponseEntity<>(meetingRoomService.deleteBookMeetingRoom(id), HttpStatus.OK);
	}
}
