package com.ciw.backend.service;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.MeetingRoom;
import com.ciw.backend.entity.MeetingRoomCalendar;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.mail.MailSender;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.MapResponseWithoutPage;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.calendar.CalendarPart;
import com.ciw.backend.payload.calendar.ShiftType;
import com.ciw.backend.payload.meetingroom.*;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.user.SimpleUserResponse;
import com.ciw.backend.repository.MeetingRoomCalendarRepository;
import com.ciw.backend.repository.MeetingRoomRepository;
import com.ciw.backend.repository.NotificationRepository;
import com.ciw.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MeetingRoomService {
	private final ObjectMapper objectMapper;
	private final MeetingRoomRepository meetingRoomRepository;
	private final MeetingRoomCalendarRepository meetingRoomCalendarRepository;
	private final UserRepository userRepository;
	private final NotificationRepository notificationRepository;
	private final MailSender mailSender;

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

	@Transactional
	public MeetingRoomResponse createMeetingRoom(CreateMeetingRoomRequest request) {
		MeetingRoom meetingRoom = mapToMeetingRoomEntity(request);
		if (meetingRoom.getLocation() == null) {
			meetingRoom.setLocation(meetingRoom.getName());
		}

		MeetingRoom savedMeetingRoom = meetingRoomRepository.save(meetingRoom);

		return mapToDTO(savedMeetingRoom);
	}

	@Transactional
	public MeetingRoomResponse updateMeetingRoom(Long meetingRoomId, UpdateMeetingRoomRequest request) {
		MeetingRoom meetingRoom = Common.findMeetingRoomById(meetingRoomId, meetingRoomRepository);

		Common.updateIfNotNull(request.getName(), meetingRoom::setName);
		Common.updateIfNotNull(request.getLocation(), meetingRoom::setLocation);

		MeetingRoom savedMeetingRoom = meetingRoomRepository.save(meetingRoom);

		return mapToDTO(savedMeetingRoom);
	}

	@Transactional
	public SimpleResponse deleteMeetingRoom(Long meetingRoomId) {
		MeetingRoom meetingRoom = Common.findMeetingRoomById(meetingRoomId, meetingRoomRepository);

		if (meetingRoomCalendarRepository.existsByMeetingRoomIdAndDateAfter(meetingRoomId, new Date())) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.MeetingRoom.CAN_NOT_DELETE_BOOKED);
		}

		meetingRoomCalendarRepository.deleteByMeetingRoomId(meetingRoomId);
		meetingRoomRepository.delete(meetingRoom);

		return new SimpleResponse();
	}

	@Transactional
	public MapResponseWithoutPage<MeetingRoomCalendarDayResponse, MeetingRoomCalendarFilter> getMeetingRoomCalendar(
			MeetingRoomCalendarFilter filter) {
		Specification<MeetingRoomCalendar> spec = filterMeetingRoomCalendar(filter);

		List<MeetingRoomCalendar> calendars = meetingRoomCalendarRepository.findAll(spec);

		return MapResponseWithoutPage.<MeetingRoomCalendarDayResponse, MeetingRoomCalendarFilter>builder()
									 .data(mapToDTO(calendars))
									 .filter(filter)
									 .build();
	}

	private Specification<MeetingRoomCalendar> filterMeetingRoomCalendar(MeetingRoomCalendarFilter filter) {
		Specification<MeetingRoomCalendar> spec = Specification.where(null);
		if (filter.getBookedBy() != null) {
			spec = MeetingRoomCalendarSpecs.isBookedBy(filter.getBookedBy());
		}
		if (filter.getCreatedBy() != null) {
			spec = spec.and(MeetingRoomCalendarSpecs.isCreatedBy(filter.getCreatedBy()));
		}
		if (filter.getMeetingRoom() != null) {
			spec = spec.and(MeetingRoomCalendarSpecs.hasMeetingRoom(filter.getMeetingRoom()));
		}
		if (filter.getFrom() != null) {
			spec = spec.and(MeetingRoomCalendarSpecs.isDateBookedAtAfter(filter.getFrom()));
		}
		if (filter.getTo() != null) {
			spec = spec.and(MeetingRoomCalendarSpecs.isDateBookedAtBefore(filter.getTo()));
		}
		return spec;
	}

	@Transactional
	public SimpleResponse bookMeetingRoom(Long id, BookMeetingRoomRequest request) {
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

		Common.sendNotification(notificationRepository,
								mailSender,
								bookedBy,
								bookedBy,
								"Phòng họp đã được đặt",
								String.format(
										"Bạn đã đặt phòng họp %s thành công.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.",
										meetingRoom.getName()));

		return new SimpleResponse();
	}

	@Transactional
	public SimpleResponse deleteBookMeetingRoom(Long bookId) {
		MeetingRoomCalendar meetingRoomCalendar = Common.findMeetingRoomCalendarById(bookId,
																					 meetingRoomCalendarRepository);

		meetingRoomCalendarRepository.delete(meetingRoomCalendar);

		User sender = Common.findCurrUser(userRepository);

		Common.sendNotification(notificationRepository,
								mailSender,
								meetingRoomCalendar.getBookedBy(),
								sender,
								"Lịch phòng họp của bạn có sự thay đổi",
								String.format(
										"Lịch phòng họp %s vào buổi %s đã bị xóa.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.",
										meetingRoomCalendar.getMeetingRoom().getName(),
										meetingRoomCalendar.getShiftType() == ShiftType.DAY ? "sáng" : "tối"));

		return new SimpleResponse();
	}

	private MeetingRoomResponse mapToDTO(MeetingRoom meetingRoom) {
		return objectMapper.convertValue(meetingRoom, MeetingRoomResponse.class);
	}

	private MeetingRoomCalendarResponse mapToDTO(MeetingRoomCalendar calendar) {
		return MeetingRoomCalendarResponse.builder()
										  .id(calendar.getId())
										  .createdBy(mapToSimpleDTO(calendar.getCreatedBy()))
										  .bookedBy(mapToSimpleDTO(calendar.getBookedBy()))
										  .meetingRoom(mapToDTO(calendar.getMeetingRoom()))
										  .build();
	}

	private SimpleUserResponse mapToSimpleDTO(User user) {
		return SimpleUserResponse.builder()
								 .id(user.getId())
								 .name(user.getName())
								 .email(user.getEmail())
								 .phone(user.getPhone())
								 .image(user.getImage())
								 .build();
	}

	private Map<String, MeetingRoomCalendarDayResponse> mapToDTO(List<MeetingRoomCalendar> calendars) {
		DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

		Map<String, List<MeetingRoomCalendar>> maps = new HashMap<>();
		for (MeetingRoomCalendar calendar : calendars) {
			String date = formatter.format(calendar.getDate());

			if (!maps.containsKey(date)) {
				List<MeetingRoomCalendar> list = new ArrayList<>();
				list.add(calendar);
				maps.put(date, list);
			} else {
				List<MeetingRoomCalendar> list = maps.get(date);
				list.add(calendar);
			}
		}

		Map<String, MeetingRoomCalendarDayResponse> res = new HashMap<>();
		for (Map.Entry<String, List<MeetingRoomCalendar>> entry : maps.entrySet()) {
			List<MeetingRoomCalendarResponse> day = new ArrayList<>();
			List<MeetingRoomCalendarResponse> night = new ArrayList<>();

			for (MeetingRoomCalendar meetingRoomCalendar : entry.getValue()) {
				if (meetingRoomCalendar.getShiftType() == ShiftType.DAY) {
					day.add(mapToDTO(meetingRoomCalendar));
				} else if (meetingRoomCalendar.getShiftType() == ShiftType.NIGHT) {
					night.add(mapToDTO(meetingRoomCalendar));
				}
			}

			res.put(entry.getKey(), MeetingRoomCalendarDayResponse.builder()
																  .day(day)
																  .night(night)
																  .build());
		}

		return res;
	}

	private MeetingRoom mapToMeetingRoomEntity(CreateMeetingRoomRequest request) {
		return objectMapper.convertValue(request, MeetingRoom.class);
	}
}
