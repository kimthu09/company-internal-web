package com.ciw.backend.service;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.Resource;
import com.ciw.backend.entity.ResourceCalendar;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.MapResponseWithoutPage;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.calendar.CalendarPart;
import com.ciw.backend.payload.calendar.ShiftType;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.resource.*;
import com.ciw.backend.payload.user.SimpleUserResponse;
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

	@Transactional
	public ListResponse<ResourceResponse, ResourceFilter> getResources(AppPageRequest page,
																	   ResourceFilter filter) {
		Pageable pageable = PageRequest.of(page.getPage() - 1,
										   page.getLimit(),
										   Sort.by(Sort.Direction.ASC, "name"));
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

	@Transactional public SimpleResponse deleteResource(Long resourceId) {
		Resource resource = Common.findResourceById(resourceId, resourceRepository);

		if (resourceCalendarRepository.existsByResourceIdAndDateAfter(resourceId, new Date())) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.Resource.CAN_NOT_DELETE_BOOKED);
		}

		resourceCalendarRepository.deleteByResourceId(resourceId);
		resourceRepository.delete(resource);

		return new SimpleResponse();
	}

	@Transactional
	public MapResponseWithoutPage<ResourceCalendarDayResponse, ResourceCalendarFilter> getResourceCalendar(
			ResourceCalendarFilter filter) {
		Specification<ResourceCalendar> spec = filterResourceCalendar(filter);

		List<ResourceCalendar> calendars = resourceCalendarRepository.findAll(spec);

		return MapResponseWithoutPage.<ResourceCalendarDayResponse, ResourceCalendarFilter>builder()
									 .data(mapToDTO(calendars))
									 .filter(filter)
									 .build();
	}

	private Specification<ResourceCalendar> filterResourceCalendar(ResourceCalendarFilter filter) {
		Specification<ResourceCalendar> spec = Specification.where(null);
		if (filter.getBookedBy() != null) {
			spec = ResourceCalendarSpecs.isBookedBy(filter.getBookedBy());
		}
		if (filter.getCreatedBy() != null) {
			spec = spec.and(ResourceCalendarSpecs.isCreatedBy(filter.getCreatedBy()));
		}
		if (filter.getMeetingRoom() != null) {
			spec = spec.and(ResourceCalendarSpecs.hasMeetingRoom(filter.getMeetingRoom()));
		}
		if (filter.getFrom() != null) {
			spec = spec.and(ResourceCalendarSpecs.isDateBookedAtAfter(filter.getFrom()));
		}
		if (filter.getTo() != null) {
			spec = spec.and(ResourceCalendarSpecs.isDateBookedAtBefore(filter.getTo()));
		}
		return spec;
	}

	@Transactional public SimpleResponse bookResource(Long id, BookResourceRequest request) {
		Resource resource = Common.findResourceById(id, resourceRepository);

		User bookedBy = Common.findUserById(request.getBookedBy(), userRepository);

		List<CalendarPart> calendarParts = Common.generateCalendarPart(request.getFrom(), request.getTo());

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		List<ResourceCalendar> calendars = calendarParts.stream().map(cp -> {
			LocalDate localDate = LocalDate.parse(cp.getDate(), formatter);
			Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

			return ResourceCalendar.builder()
								   .bookedBy(bookedBy)
								   .resource(resource)
								   .shiftType(cp.getShiftType())
								   .date(date)
								   .build();
		}).toList();

		resourceCalendarRepository.saveAll(calendars);

		return new SimpleResponse();
	}

	@Transactional public SimpleResponse deleteResourceCalendar(Long bookId) {
		ResourceCalendar resourceCalendar = Common.findResourceCalendarById(bookId, resourceCalendarRepository);

		resourceCalendarRepository.delete(resourceCalendar);

		return new SimpleResponse();
	}

	private ResourceResponse mapToDTO(Resource Resource) {
		return objectMapper.convertValue(Resource, ResourceResponse.class);
	}

	private ResourceCalendarResponse mapToDTO(ResourceCalendar calendar) {
		return ResourceCalendarResponse.builder()
									   .id(calendar.getId())
									   .createdBy(mapToSimpleDTO(calendar.getCreatedBy()))
									   .bookedBy(mapToSimpleDTO(calendar.getBookedBy()))
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

	private Map<String, ResourceCalendarDayResponse> mapToDTO(List<ResourceCalendar> calendars) {
		DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

		Map<String, List<ResourceCalendar>> maps = new HashMap<>();
		for (ResourceCalendar calendar : calendars) {
			String date = formatter.format(calendar.getDate());

			if (!maps.containsKey(date)) {
				List<ResourceCalendar> list = new ArrayList<>();
				list.add(calendar);
				maps.put(date, list);
			} else {
				List<ResourceCalendar> list = maps.get(date);
				list.add(calendar);
			}
		}

		Map<String, ResourceCalendarDayResponse> res = new HashMap<>();
		for (Map.Entry<String, List<ResourceCalendar>> entry : maps.entrySet()) {
			List<ResourceCalendarResponse> day = new ArrayList<>();
			List<ResourceCalendarResponse> night = new ArrayList<>();

			for (ResourceCalendar resourceCalendar : entry.getValue()) {
				if (resourceCalendar.getShiftType() == ShiftType.DAY) {
					day.add(mapToDTO(resourceCalendar));
				} else if (resourceCalendar.getShiftType() == ShiftType.NIGHT) {
					night.add(mapToDTO(resourceCalendar));
				}
			}

			res.put(entry.getKey(), ResourceCalendarDayResponse.builder()
															   .day(day)
															   .night(night)
															   .build());
		}

		return res;
	}

	private Resource mapToEntity(CreateResourceRequest request) {
		return objectMapper.convertValue(request, Resource.class);
	}
}
