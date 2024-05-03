package com.ciw.backend.service;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.MeetingRoom;
import com.ciw.backend.entity.MeetingRoomCalendar;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.mail.MailSender;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.ListResponseWithoutPage;
import com.ciw.backend.payload.SimpleListResponse;
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
import java.text.ParseException;
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
	public GetUnbookMeetingRoomResponse getUnbookMeetingRoom(GetUnbookMeetingRoomRequest request) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		Date date;
		try {
			date = dateFormat.parse(request.getDate());
		} catch (ParseException e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.Calendar.DATE_VALIDATE);
		}

		List<MeetingRoomCalendar> bookedMeetingRoom = meetingRoomCalendarRepository.getByDate(date);
		List<Long> bookedIdsInDay = bookedMeetingRoom.stream()
													 .filter(book -> book.getShiftType() == ShiftType.DAY)
													 .map(book -> book.getMeetingRoom().getId())
													 .toList();
		List<Long> bookedIdsInNight = bookedMeetingRoom.stream()
													   .filter(book -> book.getShiftType() == ShiftType.NIGHT)
													   .map(book -> book.getMeetingRoom().getId())
													   .toList();

		List<MeetingRoom> meetingRooms = meetingRoomRepository.findAll();
		return GetUnbookMeetingRoomResponse.builder()
										   .day(meetingRooms.stream()
															.filter(meetingRoom -> !bookedIdsInDay.contains(meetingRoom.getId()))
															.map(this::mapToDTO)
															.toList())
										   .night(meetingRooms.stream()
															  .filter(meetingRoom -> !bookedIdsInNight.contains(
																	  meetingRoom.getId()))
															  .map(this::mapToDTO)
															  .toList())
										   .build();
	}

	@Transactional
	public SimpleListResponse<MeetingRoomResponse> getUnbookMeetingRoomByDateRange(GetUnbookMeetingRoomDateRangeRequest request) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		Date from;
		Date to;
		try {
			from = dateFormat.parse(request.getFrom().getDate());
			to   = dateFormat.parse(request.getTo().getDate());
		} catch (ParseException e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.Calendar.DATE_VALIDATE);
		}

		List<MeetingRoomCalendar> bookedMeetingRoom = meetingRoomCalendarRepository.getByDateBetween(from, to);

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		List<Long> bookedIds = bookedMeetingRoom.stream().filter(book -> {
			LocalDate localDate = book.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
			if (localDate.format(formatter).equals(request.getFrom().getDate())) {
				if (book.getShiftType() == ShiftType.NIGHT) {
					return true;
				}
				return request.getFrom().getShiftType() == ShiftType.DAY;
			} else if (localDate.format(formatter).equals(request.getTo().getDate())) {
				if (book.getShiftType() == ShiftType.DAY) {
					return true;
				}
				return request.getTo().getShiftType() == ShiftType.NIGHT;
			}
			return true;
		}).map(book -> book.getMeetingRoom().getId()).toList();

		List<MeetingRoom> meetingRooms = meetingRoomRepository.findAll();

		List<MeetingRoomResponse> res = meetingRooms.stream()
													.filter(meetingRoom -> !bookedIds.contains(meetingRoom.getId()))
													.map(this::mapToDTO)
													.toList();
		return new SimpleListResponse<>(res);
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
	public ListResponseWithoutPage<MeetingRoomCalendarDayResponse, MeetingRoomCalendarFilter> getMeetingRoomCalendar(
			MeetingRoomCalendarFilter filter) {
		Specification<MeetingRoomCalendar> spec = filterMeetingRoomCalendar(filter);

		List<MeetingRoomCalendar> calendars = meetingRoomCalendarRepository.findAll(spec);

		return ListResponseWithoutPage.<MeetingRoomCalendarDayResponse, MeetingRoomCalendarFilter>builder()
									  .data(mapToDTO(calendars))
									  .filter(filter)
									  .build();
	}

	private Specification<MeetingRoomCalendar> filterMeetingRoomCalendar(MeetingRoomCalendarFilter filter) {
		Specification<MeetingRoomCalendar> spec = Specification.where(null);
		if (filter.getCreatedBy() != null) {
			spec = MeetingRoomCalendarSpecs.isCreatedBy(filter.getCreatedBy());
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
	public ListResponseWithoutPage<MeetingRoomCalendarDayResponse, PersonalMeetingRoomCalendarFilter> getPersonalMeetingRoomCalendar(
			PersonalMeetingRoomCalendarFilter filter) {
		User curr = Common.findCurrUser(userRepository);

		Specification<MeetingRoomCalendar> spec = filterMeetingRoomCalendar(curr.getId(), filter);

		List<MeetingRoomCalendar> calendars = meetingRoomCalendarRepository.findAll(spec);

		return ListResponseWithoutPage.<MeetingRoomCalendarDayResponse, PersonalMeetingRoomCalendarFilter>builder()
									  .data(mapToDTO(calendars))
									  .filter(filter)
									  .build();
	}

	private Specification<MeetingRoomCalendar> filterMeetingRoomCalendar( Long createdById, PersonalMeetingRoomCalendarFilter filter) {
		Specification<MeetingRoomCalendar> spec = MeetingRoomCalendarSpecs.isCreatedBy(createdById.toString());
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

		List<CalendarPart> calendarParts = Common.generateCalendarPart(request.getFrom(), request.getTo());

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		List<MeetingRoomCalendar> calendars = calendarParts.stream().map(cp -> {
			LocalDate localDate = LocalDate.parse(cp.getDate(), formatter);
			Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

			return MeetingRoomCalendar.builder()
									  .meetingRoom(meetingRoom)
									  .shiftType(cp.getShiftType())
									  .date(date)
									  .note(request.getNote())
									  .build();
		}).toList();

		meetingRoomCalendarRepository.saveAll(calendars);

		User curr = Common.findCurrUser(userRepository);
		Common.sendNotification(notificationRepository,
								mailSender,
								curr,
								curr,
								"Phòng họp đã được đặt",
								String.format(
										"Bạn đã đặt phòng họp %s thành công vào buổi %s ngày %s tới hết buổi %s ngày %s.\n" +
										"Nếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.",
										meetingRoom.getName(),
										request.getFrom().getShiftType() == ShiftType.DAY ? "sáng" : "chiều",
										request.getFrom().getDate(),
										request.getFrom().getShiftType() == ShiftType.DAY ? "sáng" : "chiều",
										request.getFrom().getDate()));

		return new SimpleResponse();
	}

	@Transactional
	public SimpleResponse deleteBookMeetingRoom(Long bookId) {
		MeetingRoomCalendar meetingRoomCalendar = Common.findMeetingRoomCalendarById(bookId,
																					 meetingRoomCalendarRepository);
		User curr = Common.findCurrUser(userRepository);
		if (!curr.getId().equals(meetingRoomCalendar.getCreatedBy().getId()) &&
			!curr.getEmail().equals(ApplicationConst.ADMIN_EMAIL)) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.USER_NOT_HAVE_FEATURE);
		}

		meetingRoomCalendarRepository.delete(meetingRoomCalendar);

		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		Common.sendNotification(notificationRepository,
								mailSender,
								meetingRoomCalendar.getCreatedBy(),
								curr,
								"Lịch phòng họp của bạn có sự thay đổi",
								String.format(
										"Lịch phòng họp %s vào buổi %s ngày %s đã bị xóa.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.",
										meetingRoomCalendar.getMeetingRoom().getName(),
										meetingRoomCalendar.getShiftType() == ShiftType.DAY ? "sáng" : "chiều",
										formatter.format(meetingRoomCalendar.getDate())));

		return new SimpleResponse();
	}

	private MeetingRoomResponse mapToDTO(MeetingRoom meetingRoom) {
		return objectMapper.convertValue(meetingRoom, MeetingRoomResponse.class);
	}

	private MeetingRoomCalendarResponse mapToDTO(MeetingRoomCalendar calendar) {
		return MeetingRoomCalendarResponse.builder()
										  .id(calendar.getId())
										  .createdBy(mapToSimpleDTO(calendar.getCreatedBy()))
										  .meetingRoom(mapToDTO(calendar.getMeetingRoom()))
										  .note(calendar.getNote())
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

	private List<MeetingRoomCalendarDayResponse> mapToDTO(List<MeetingRoomCalendar> calendars) {
		DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

		Map<String, List<MeetingRoomCalendar>> mapEntity = new HashMap<>();
		for (MeetingRoomCalendar calendar : calendars) {
			String date = formatter.format(calendar.getDate());

			if (!mapEntity.containsKey(date)) {
				List<MeetingRoomCalendar> list = new ArrayList<>();
				list.add(calendar);
				mapEntity.put(date, list);
			} else {
				List<MeetingRoomCalendar> list = mapEntity.get(date);
				list.add(calendar);
			}
		}

		Map<String, MeetingRoomCalendarDayResponse> mapRes = new HashMap<>();
		for (Map.Entry<String, List<MeetingRoomCalendar>> entry : mapEntity.entrySet()) {
			List<MeetingRoomCalendarResponse> day = new ArrayList<>();
			List<MeetingRoomCalendarResponse> night = new ArrayList<>();

			for (MeetingRoomCalendar meetingRoomCalendar : entry.getValue()) {
				if (meetingRoomCalendar.getShiftType() == ShiftType.DAY) {
					day.add(mapToDTO(meetingRoomCalendar));
				} else if (meetingRoomCalendar.getShiftType() == ShiftType.NIGHT) {
					night.add(mapToDTO(meetingRoomCalendar));
				}
			}

			mapRes.put(entry.getKey(),
					   MeetingRoomCalendarDayResponse.builder().date(entry.getKey()).day(day).night(night).build());
		}

		return mapRes.entrySet()
					 .stream()
					 .sorted(Map.Entry.comparingByKey(Common.dateComparator))
					 .map(Map.Entry::getValue)
					 .toList();
	}

	private MeetingRoom mapToMeetingRoomEntity(CreateMeetingRoomRequest request) {
		return objectMapper.convertValue(request, MeetingRoom.class);
	}
}
