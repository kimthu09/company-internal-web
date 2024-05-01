package com.ciw.backend.service;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.Resource;
import com.ciw.backend.entity.ResourceCalendar;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.mail.MailSender;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.ListResponseWithoutPage;
import com.ciw.backend.payload.SimpleListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.calendar.CalendarPart;
import com.ciw.backend.payload.calendar.ShiftType;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.resource.*;
import com.ciw.backend.payload.user.SimpleUserResponse;
import com.ciw.backend.repository.NotificationRepository;
import com.ciw.backend.repository.ResourceCalendarRepository;
import com.ciw.backend.repository.ResourceRepository;
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
public class ResourceService {
	private final ObjectMapper objectMapper;
	private final ResourceRepository resourceRepository;
	private final ResourceCalendarRepository resourceCalendarRepository;
	private final UserRepository userRepository;
	private final NotificationRepository notificationRepository;
	private final MailSender mailSender;

	@Transactional
	public ListResponse<ResourceResponse, ResourceFilter> getResources(AppPageRequest page, ResourceFilter filter) {
		Pageable pageable = PageRequest.of(page.getPage() - 1, page.getLimit(), Sort.by(Sort.Direction.ASC, "name"));
		Specification<Resource> spec = filterResources(filter);

		Page<Resource> ResourcePage = resourceRepository.findAll(spec, pageable);

		List<Resource> Resources = ResourcePage.getContent();

		List<ResourceResponse> data = Resources.stream().map(this::mapToDTO).toList();

		return ListResponse.<ResourceResponse, ResourceFilter>builder()
						   .data(data)
						   .appPageResponse(AppPageResponse.builder()
														   .index(page.getPage())
														   .limit(page.getLimit())
														   .totalPages(ResourcePage.getTotalPages())
														   .totalElements(ResourcePage.getTotalElements())
														   .build())
						   .filter(filter)
						   .build();
	}

	private Specification<Resource> filterResources(ResourceFilter filter) {
		Specification<Resource> spec = Specification.where(null);
		if (filter.getName() != null) {
			spec = ResourceSpecs.hasName(filter.getName());
		}
		return spec;
	}

	@Transactional
	public GetUnbookResourceResponse getUnbookResourceBySpecificDate(GetUnbookResourceRequest request) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		Date date;
		try {
			date = dateFormat.parse(request.getDate());
		} catch (ParseException e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.Calendar.DATE_VALIDATE);
		}

		List<ResourceCalendar> bookedResource = resourceCalendarRepository.getByDate(date);
		List<Long> bookedIdsInDay = bookedResource.stream()
												  .filter(book -> book.getShiftType() == ShiftType.DAY)
												  .map(book -> book.getResource().getId())
												  .toList();
		List<Long> bookedIdsInNight = bookedResource.stream()
													.filter(book -> book.getShiftType() == ShiftType.NIGHT)
													.map(book -> book.getResource().getId())
													.toList();

		List<Resource> resources = resourceRepository.findAll();
		return GetUnbookResourceResponse.builder()
										.day(resources.stream()
													  .filter(resource -> !bookedIdsInDay.contains(resource.getId()))
													  .map(this::mapToDTO)
													  .toList())
										.night(resources.stream()
														.filter(resource -> !bookedIdsInNight.contains(resource.getId()))
														.map(this::mapToDTO)
														.toList())
										.build();
	}

	@Transactional
	public SimpleListResponse<ResourceResponse> getUnbookResourceByDateRange(GetUnbookResourceDateRangeRequest request) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		Date from;
		Date to;
		try {
			from = dateFormat.parse(request.getFrom().getDate());
			to   = dateFormat.parse(request.getTo().getDate());
		} catch (ParseException e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.Calendar.DATE_VALIDATE);
		}

		List<ResourceCalendar> bookedResource = resourceCalendarRepository.getByDateBetween(from, to);

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		List<Long> bookedIds = bookedResource.stream().filter(book -> {
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
		}).map(book -> book.getResource().getId()).toList();

		List<Resource> resources = resourceRepository.findAll();

		List<ResourceResponse> res = resources.stream()
											  .filter(resource -> !bookedIds.contains(resource.getId()))
											  .map(this::mapToDTO)
											  .toList();
		return new SimpleListResponse<>(res);
	}

	@Transactional
	public ResourceResponse createResource(CreateResourceRequest request) {
		Resource resource = mapToEntity(request);

		Resource savedResource = resourceRepository.save(resource);

		return mapToDTO(savedResource);
	}

	@Transactional
	public ResourceResponse updateResource(Long ResourceId, UpdateResourceRequest request) {
		Resource resource = Common.findResourceById(ResourceId, resourceRepository);

		Common.updateIfNotNull(request.getName(), resource::setName);

		Resource savedResource = resourceRepository.save(resource);

		return mapToDTO(savedResource);
	}

	@Transactional
	public SimpleResponse deleteResource(Long resourceId) {
		Resource resource = Common.findResourceById(resourceId, resourceRepository);

		if (resourceCalendarRepository.existsByResourceIdAndDateAfter(resourceId, new Date())) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.Resource.CAN_NOT_DELETE_BOOKED);
		}

		resourceCalendarRepository.deleteByResourceId(resourceId);
		resourceRepository.delete(resource);

		return new SimpleResponse();
	}

	@Transactional
	public ListResponseWithoutPage<ResourceCalendarDayResponse, ResourceCalendarFilter> getResourceCalendar(
			ResourceCalendarFilter filter) {
		Specification<ResourceCalendar> spec = filterResourceCalendar(filter);

		List<ResourceCalendar> calendars = resourceCalendarRepository.findAll(spec);

		return ListResponseWithoutPage.<ResourceCalendarDayResponse, ResourceCalendarFilter>builder()
									  .data(mapToDTO(calendars))
									  .filter(filter)
									  .build();
	}

	private Specification<ResourceCalendar> filterResourceCalendar(ResourceCalendarFilter filter) {
		Specification<ResourceCalendar> spec = Specification.where(null);
		if (filter.getCreatedBy() != null) {
			spec = ResourceCalendarSpecs.isCreatedBy(filter.getCreatedBy());
		}
		if (filter.getResource() != null) {
			spec = spec.and(ResourceCalendarSpecs.hasResource(filter.getResource()));
		}
		if (filter.getFrom() != null) {
			spec = spec.and(ResourceCalendarSpecs.isDateBookedAtAfter(filter.getFrom()));
		}
		if (filter.getTo() != null) {
			spec = spec.and(ResourceCalendarSpecs.isDateBookedAtBefore(filter.getTo()));
		}
		return spec;
	}

	@Transactional
	public SimpleResponse bookResource(Long id, BookResourceRequest request) {
		Resource resource = Common.findResourceById(id, resourceRepository);

		List<CalendarPart> calendarParts = Common.generateCalendarPart(request.getFrom(), request.getTo());

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		List<ResourceCalendar> calendars = calendarParts.stream().map(cp -> {
			LocalDate localDate = LocalDate.parse(cp.getDate(), formatter);
			Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

			return ResourceCalendar.builder().resource(resource).shiftType(cp.getShiftType()).date(date).build();
		}).toList();

		resourceCalendarRepository.saveAll(calendars);

		User curr = Common.findCurrUser(userRepository);
		Common.sendNotification(notificationRepository,
								mailSender,
								curr,
								curr,
								"Tài nguyên đã được đặt",
								String.format(
										"Bạn đã đặt tài nguyên %s thành công vào buổi %s ngày %s tới hết buổi %s ngày %s.\n" +
										"Nếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.",
										resource.getName(),
										request.getFrom().getShiftType() == ShiftType.DAY ? "sáng" : "chiều",
										request.getFrom().getDate(),
										request.getFrom().getShiftType() == ShiftType.DAY ? "sáng" : "chiều",
										request.getFrom().getDate()));

		return new SimpleResponse();
	}

	@Transactional
	public SimpleResponse deleteResourceCalendar(Long bookId) {
		ResourceCalendar resourceCalendar = Common.findResourceCalendarById(bookId, resourceCalendarRepository);
		User curr = Common.findCurrUser(userRepository);
		if (!curr.getId().equals(resourceCalendar.getCreatedBy().getId()) &&
			!curr.getEmail().equals(ApplicationConst.ADMIN_EMAIL)) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.USER_NOT_HAVE_FEATURE);
		}

		resourceCalendarRepository.delete(resourceCalendar);

		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		Common.sendNotification(notificationRepository,
								mailSender,
								resourceCalendar.getCreatedBy(),
								curr,
								"Lịch tài nguyên của bạn có sự thay đổi",
								String.format(
										"Lịch tài nguyên %s vào buổi %s ngày %s đã bị xóa.\nNếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.",
										resourceCalendar.getResource().getName(),
										resourceCalendar.getShiftType() == ShiftType.DAY ? "sáng" : "chiều",
										formatter.format(resourceCalendar.getDate())));

		return new SimpleResponse();
	}

	private ResourceResponse mapToDTO(Resource Resource) {
		return objectMapper.convertValue(Resource, ResourceResponse.class);
	}

	private ResourceCalendarResponse mapToDTO(ResourceCalendar calendar) {
		return ResourceCalendarResponse.builder()
									   .id(calendar.getId())
									   .createdBy(mapToSimpleDTO(calendar.getCreatedBy()))
									   .resource(mapToDTO(calendar.getResource()))
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

	private List<ResourceCalendarDayResponse> mapToDTO(List<ResourceCalendar> calendars) {
		DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

		Map<String, List<ResourceCalendar>> mapEntity = new HashMap<>();
		for (ResourceCalendar calendar : calendars) {
			String date = formatter.format(calendar.getDate());

			if (!mapEntity.containsKey(date)) {
				List<ResourceCalendar> list = new ArrayList<>();
				list.add(calendar);
				mapEntity.put(date, list);
			} else {
				List<ResourceCalendar> list = mapEntity.get(date);
				list.add(calendar);
			}
		}

		Map<String, ResourceCalendarDayResponse> mapRes = new HashMap<>();
		for (Map.Entry<String, List<ResourceCalendar>> entry : mapEntity.entrySet()) {
			List<ResourceCalendarResponse> day = new ArrayList<>();
			List<ResourceCalendarResponse> night = new ArrayList<>();

			for (ResourceCalendar resourceCalendar : entry.getValue()) {
				if (resourceCalendar.getShiftType() == ShiftType.DAY) {
					day.add(mapToDTO(resourceCalendar));
				} else if (resourceCalendar.getShiftType() == ShiftType.NIGHT) {
					night.add(mapToDTO(resourceCalendar));
				}
			}

			mapRes.put(entry.getKey(),
					   ResourceCalendarDayResponse.builder().date(entry.getKey()).day(day).night(night).build());
		}

		return mapRes.entrySet()
					 .stream()
					 .sorted(Map.Entry.comparingByKey(Common.dateComparator))
					 .map(Map.Entry::getValue)
					 .toList();
	}

	private Resource mapToEntity(CreateResourceRequest request) {
		return objectMapper.convertValue(request, Resource.class);
	}
}
