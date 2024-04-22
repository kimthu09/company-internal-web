package com.ciw.backend.service;

import com.ciw.backend.entity.MeetingRoomCalendar;
import com.ciw.backend.entity.Resource;
import com.ciw.backend.entity.ResourceCalendar;
import com.ciw.backend.entity.User;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.calendar.CalendarPart;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.resource.*;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

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

	private Resource mapToEntity(CreateResourceRequest request) {
		return objectMapper.convertValue(request, Resource.class);
	}
}
