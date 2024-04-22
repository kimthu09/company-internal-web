package com.ciw.backend.service;

import com.ciw.backend.entity.MeetingRoom;
import com.ciw.backend.entity.MeetingRoomCalendar;
import com.ciw.backend.entity.User;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.calendar.CalendarPart;
import com.ciw.backend.payload.meetingroom.*;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.repository.MeetingRoomCalendarRepository;
import com.ciw.backend.repository.MeetingRoomRepository;
import com.ciw.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Service @RequiredArgsConstructor public class MeetingRoomService {
	private final ObjectMapper objectMapper;
	private final MeetingRoomRepository meetingRoomRepository;
	private final MeetingRoomCalendarRepository meetingRoomCalendarRepository;
	private final UserRepository userRepository;

	@Transactional
	public ListResponse<MeetingRoomResponse, MeetingRoomFilter> getMeetingRooms(AppPageRequest page,
																				MeetingRoomFilter filter) {
		Pageable pageable = PageRequest.of(page.getPage() - 1, page.getLimit(), Sort.by(Sort.Direction.ASC, "name"));
		Specification<MeetingRoom> spec = filterMeetingRooms(filter);

		Page<MeetingRoom> meetingRoomPage = meetingRoomRepository.findAll(spec, pageable);

		List<MeetingRoom> meetingRooms = meetingRoomPage.getContent();

		List<MeetingRoomResponse> data = meetingRooms.stream().map(this::mapToDTO).toList();

		return ListResponse.<MeetingRoomResponse, MeetingRoomFilter>builder()
						   .data(data)
						   .appPageResponse(AppPageResponse.builder()
														   .index(page.getPage())
														   .limit(page.getLimit())
														   .totalPages(meetingRoomPage.getTotalPages())
														   .totalElements(meetingRoomPage.getTotalElements())
														   .build())
						   .filter(filter)
						   .build();
	}

	private Specification<MeetingRoom> filterMeetingRooms(MeetingRoomFilter filter) {
		Specification<MeetingRoom> spec = Specification.where(null);
		if (filter.getName() != null) {
			spec = MeetingRoomSpecs.hasName(filter.getName());
		}
		if (filter.getLocation() != null) {
			spec = spec.and(MeetingRoomSpecs.hasLocation(filter.getLocation()));
		}
		return spec;
	}

	@Transactional public MeetingRoomResponse createMeetingRoom(CreateMeetingRoomRequest request) {
		MeetingRoom meetingRoom = mapToMeetingRoomEntity(request);
		if (meetingRoom.getLocation() == null) {
			meetingRoom.setLocation(meetingRoom.getName());
		}

		MeetingRoom savedMeetingRoom = meetingRoomRepository.save(meetingRoom);

		return mapToDTO(savedMeetingRoom);
	}

	@Transactional public MeetingRoomResponse updateMeetingRoom(Long meetingRoomId, UpdateMeetingRoomRequest request) {
		MeetingRoom meetingRoom = Common.findMeetingRoomById(meetingRoomId, meetingRoomRepository);

		Common.updateIfNotNull(request.getName(), meetingRoom::setName);
		Common.updateIfNotNull(request.getLocation(), meetingRoom::setLocation);

		MeetingRoom savedMeetingRoom = meetingRoomRepository.save(meetingRoom);

		return mapToDTO(savedMeetingRoom);
	}

	@Transactional public SimpleResponse bookMeetingRoom(Long id, BookMeetingRoomRequest request) {
		MeetingRoom meetingRoom = Common.findMeetingRoomById(id, meetingRoomRepository);

		User bookedBy = Common.findUserById(request.getBookedBy(), userRepository);

		List<CalendarPart> calendarParts = Common.generateCalendarPart(request.getFrom(), request.getTo());

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		List<MeetingRoomCalendar> calendars = calendarParts.stream().map(cp -> {
			LocalDate localDate = LocalDate.parse(cp.getDate(), formatter);
			Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

			return MeetingRoomCalendar.builder()
									  .bookedBy(bookedBy)
									  .meetingRoom(meetingRoom)
									  .shiftType(cp.getShiftType())
									  .date(date)
									  .build();
		}).toList();

		meetingRoomCalendarRepository.saveAll(calendars);

		return new SimpleResponse();
	}

	@Transactional public SimpleResponse deleteBookMeetingRoom(Long bookId) {
		MeetingRoomCalendar meetingRoomCalendar = Common.findMeetingRoomCalendarById(bookId,
																					 meetingRoomCalendarRepository);

		meetingRoomCalendarRepository.delete(meetingRoomCalendar);

		return new SimpleResponse();
	}

	private MeetingRoomResponse mapToDTO(MeetingRoom meetingRoom) {
		return objectMapper.convertValue(meetingRoom, MeetingRoomResponse.class);
	}

	private MeetingRoom mapToMeetingRoomEntity(CreateMeetingRoomRequest request) {
		return objectMapper.convertValue(request, MeetingRoom.class);
	}
}
