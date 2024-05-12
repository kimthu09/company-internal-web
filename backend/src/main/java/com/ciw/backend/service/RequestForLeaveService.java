package com.ciw.backend.service;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.RequestForLeave;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.mail.MailSender;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.calendar.ShiftType;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.requestforleave.*;
import com.ciw.backend.payload.staff.SimpleStaffResponse;
import com.ciw.backend.repository.NotificationRepository;
import com.ciw.backend.repository.RequestForLeaveRepository;
import com.ciw.backend.repository.UserRepository;
import com.ciw.backend.utils.TimeHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestForLeaveService {
	private final RequestForLeaveRepository requestForLeaveRepository;
	private final UserRepository userRepository;
	private final NotificationRepository notificationRepository;
	private final MailSender mailSender;

	@Transactional
	public ListResponse<RequestForLeaveResponse, RequestForLeaveFilter> getRequestForLeaves(AppPageRequest page,
																							RequestForLeaveFilter filter) {
		User currUser = Common.findCurrUser(userRepository);
		boolean isManager = isManager(currUser);
		boolean isAdmin = isAdmin(currUser);
		boolean isHasStaffManagerFeature = isHasStaffManagerFeature(currUser);
		if (!isAdmin && !isHasStaffManagerFeature && !isManager) {
			throw new AppException(HttpStatus.UNAUTHORIZED, Message.USER_NOT_HAVE_FEATURE);
		}

		if (isManager) {
			filter.setUnits(List.of(currUser.getUnit().getId()));
		}


		Pageable pageable = PageRequest.of(page.getPage() - 1,
										   page.getLimit(),
										   Sort.by(Sort.Direction.DESC, "createdAt"));
		Specification<RequestForLeave> spec = filterRequestForLeaves(filter);

		Page<RequestForLeave> requestPage = requestForLeaveRepository.findAll(spec, pageable);

		List<RequestForLeave> requestForLeaves = requestPage.getContent();

		List<RequestForLeaveResponse> data = requestForLeaves.stream().map(this::mapToDTO).toList();

		return ListResponse.<RequestForLeaveResponse, RequestForLeaveFilter>builder()
						   .data(data)
						   .appPageResponse(AppPageResponse.builder()
														   .index(page.getPage())
														   .limit(page.getLimit())
														   .totalPages(requestPage.getTotalPages())
														   .totalElements(requestPage.getTotalElements())
														   .build())
						   .filter(filter)
						   .build();
	}

	private boolean isManager(User userWantToCheck) {
		return userWantToCheck.getId().equals(userWantToCheck.getUnit().getManagerId());
	}

	private boolean isAdmin(User userWantToCheck) {
		return userWantToCheck.getEmail().equals(ApplicationConst.ADMIN_EMAIL);
	}

	private boolean isHasStaffManagerFeature(User userWantToCheck) {
		return userWantToCheck.getUnit()
							  .getUnitFeatures()
							  .stream()
							  .anyMatch(unitFeature -> unitFeature.getFeature()
																  .getId()
																  .equals(ApplicationConst.STAFF_MANAGER_FEATURE_ID));
	}

	private Specification<RequestForLeave> filterRequestForLeaves(RequestForLeaveFilter filter) {
		Specification<RequestForLeave> spec = Specification.where(null);
		if (filter.getUnits() != null && !filter.getUnits().isEmpty()) {
			spec = RequestForLeaveSpecs.hasUnit(filter.getUnits());
		}
		if (filter.getUsers() != null && !filter.getUsers().isEmpty()) {
			spec = spec.and(RequestForLeaveSpecs.hasUser(filter.getUsers()));
		}
		if (filter.getDateFrom() != null) {
			spec = spec.and(RequestForLeaveSpecs.isDateAfter(filter.getDateFrom()));
		}
		if (filter.getDateTo() != null) {
			spec = spec.and(RequestForLeaveSpecs.isDateBefore(filter.getDateTo()));
		}
		if (filter.getIsRejected() != null) {
			spec = spec.and(RequestForLeaveSpecs.isRejected(filter.getIsRejected()));
		}
		if (filter.getIsAccepted() != null) {
			spec = spec.and(RequestForLeaveSpecs.isAccepted(filter.getIsAccepted()));
		}
		if (filter.getIsApproved() != null) {
			spec = spec.and(RequestForLeaveSpecs.isApproved(filter.getIsApproved()));
		}
		return spec;
	}

	@Transactional
	public ListResponse<RequestForLeaveResponse, OwnRequestForLeaveFilter> getOwnRequestForLeaves(AppPageRequest page,
																								  OwnRequestForLeaveFilter filter) {
		User user = Common.findCurrUser(userRepository);

		Pageable pageable = PageRequest.of(page.getPage() - 1,
										   page.getLimit(),
										   Sort.by(Sort.Direction.DESC, "createdAt"));
		Specification<RequestForLeave> spec = filterRequestForLeaves(filter, user.getId());

		Page<RequestForLeave> requestPage = requestForLeaveRepository.findAll(spec, pageable);

		List<RequestForLeave> requestForLeaves = requestPage.getContent();

		List<RequestForLeaveResponse> data = requestForLeaves.stream().map(this::mapToDTO).toList();

		return ListResponse.<RequestForLeaveResponse, OwnRequestForLeaveFilter>builder()
						   .data(data)
						   .appPageResponse(AppPageResponse.builder()
														   .index(page.getPage())
														   .limit(page.getLimit())
														   .totalPages(requestPage.getTotalPages())
														   .totalElements(requestPage.getTotalElements())
														   .build())
						   .filter(filter)
						   .build();
	}

	private Specification<RequestForLeave> filterRequestForLeaves(OwnRequestForLeaveFilter filter, Long userId) {
		Specification<RequestForLeave> spec = RequestForLeaveSpecs.hasUser(List.of(userId));
		if (filter.getDateFrom() != null) {
			spec = spec.and(RequestForLeaveSpecs.isDateAfter(filter.getDateFrom()));
		}
		if (filter.getDateTo() != null) {
			spec = spec.and(RequestForLeaveSpecs.isDateBefore(filter.getDateTo()));
		}
		if (filter.getIsRejected() != null) {
			spec = spec.and(RequestForLeaveSpecs.isRejected(filter.getIsRejected()));
		}
		if (filter.getIsAccepted() != null) {
			spec = spec.and(RequestForLeaveSpecs.isAccepted(filter.getIsAccepted()));
		}
		if (filter.getIsApproved() != null) {
			spec = spec.and(RequestForLeaveSpecs.isApproved(filter.getIsApproved()));
		}
		return spec;
	}

	@Transactional
	public RequestForLeaveResponse createRequestForLeave(CreateRequestForLeaveRequest request) {
		User currentUser = Common.findCurrUser(userRepository);

		RequestForLeave requestForLeave = mapToEntity(request);
		requestForLeave.setCreatedBy(currentUser);
		requestForLeave.setCreatedAt(new Date());

		Common.sendNotification(notificationRepository,
								mailSender,
								currentUser,
								currentUser,
								"Đơn nghỉ phép đã được tạo",
								String.format(
										"Bạn đã đặt nghỉ phép vào ngày %s buổi %s.\n" +
										"Nếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.",
										request.getDate(),
										request.getShiftType() == ShiftType.DAY ? "sáng" : "chiều"));

		return mapToDTO(requestForLeaveRepository.save(requestForLeave));
	}

	@Transactional
	public SimpleResponse deleteRequestForLeave(Long id) {
		RequestForLeave requestForLeave = Common.findRequestForLeaveById(id, requestForLeaveRepository);
		if (requestForLeave.getApprovedBy() != null) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.RequestForLeave.REQUEST_ALREADY_HAS_BEEN_APPROVED);
		} else if (requestForLeave.getRejectedBy() != null) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.RequestForLeave.REQUEST_ALREADY_HAS_BEEN_REJECTED);
		}

		User currUser = Common.findCurrUser(userRepository);
		if (!currUser.getId().equals(requestForLeave.getCreatedBy().getId())) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.RequestForLeave.REQUEST_CAN_ONLY_DELETED_BY_CREATOR);
		}

		requestForLeaveRepository.delete(requestForLeave);

		Common.sendNotification(notificationRepository,
								mailSender,
								currUser,
								currUser,
								"Đơn nghỉ phép đã xóa",
								String.format(
										"Đơn nghỉ phép vào ngày %s buổi %s của bạn đã bị xóa.\n" +
										"Nếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.",
										requestForLeave.getDate(),
										requestForLeave.getShiftType() == ShiftType.DAY ? "sáng" : "chiều"));

		return new SimpleResponse();
	}

	@Transactional
	public SimpleResponse rejectRequestForLeave(Long id) {
		RequestForLeave requestForLeave = Common.findRequestForLeaveById(id, requestForLeaveRepository);
		if (requestForLeave.getApprovedBy() != null) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.RequestForLeave.REQUEST_ALREADY_HAS_BEEN_APPROVED);
		}

		User curr = Common.findCurrUser(userRepository);
		requestForLeave.setRejectedBy(curr);
		requestForLeave.setRejectedAt(new Date());
		requestForLeaveRepository.save(requestForLeave);

		Common.sendNotification(notificationRepository,
								mailSender,
								requestForLeave.getCreatedBy(),
								curr,
								"Đơn nghỉ phép đã bị từ chối",
								String.format(
										"Đơn nghỉ phép vào ngày %s buổi %s của bạn đã bị từ chối.\n" +
										"Nếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.",
										requestForLeave.getDate(),
										requestForLeave.getShiftType() == ShiftType.DAY ? "sáng" : "chiều"));

		return new SimpleResponse();
	}

	@Transactional
	public SimpleResponse passRequestForLeave(Long id) {
		RequestForLeave requestForLeave = Common.findRequestForLeaveById(id, requestForLeaveRepository);
		if (requestForLeave.getRejectedBy() != null) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.RequestForLeave.REQUEST_ALREADY_HAS_BEEN_REJECTED);
		} else if (requestForLeave.getApprovedBy() != null) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.RequestForLeave.REQUEST_ALREADY_HAS_BEEN_APPROVED);
		}
		String title = "Đơn xin nghỉ phép đã được phê duyệt";
		String content = String.format(
				"Đơn nghỉ phép vào ngày %s buổi %s của bạn đã được phê duyệt.\n" +
				"Nếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.",
				requestForLeave.getDate(),
				requestForLeave.getShiftType() == ShiftType.DAY ? "sáng" : "chiều");

		User currUser = Common.findCurrUser(userRepository);
		boolean isAdmin = isAdmin(currUser);
		boolean isManager = isManager(currUser, requestForLeave.getCreatedBy());
		boolean isHasStaffManagerFeature = isHasStaffManagerFeature(currUser);

		if (requestForLeave.getAcceptedBy() == null) {
			if (!isManager && !isAdmin) {
				throw new AppException(HttpStatus.UNAUTHORIZED, Message.USER_NOT_HAVE_FEATURE);
			}
			Date now = new Date();
			requestForLeave.setAcceptedBy(currUser);
			requestForLeave.setAcceptedAt(now);
			if (isAdmin) {
				requestForLeave.setApprovedBy(currUser);
				requestForLeave.setApprovedAt(now);
			} else {
				title   = "Đơn nghỉ phép đã được chuyển tới nhân sự";
				content = String.format(
						"Đơn nghỉ phép vào ngày %s buổi %s của bạn đã được chuyển tới nhân sự.\n" +
						"Nếu có sự nhầm lẫn, xin vui lòng liên hệ lại với chúng tôi.",
						requestForLeave.getDate(),
						requestForLeave.getShiftType() == ShiftType.DAY ? "sáng" : "chiều");
			}
		} else {
			if (!isHasStaffManagerFeature && !isAdmin) {
				throw new AppException(HttpStatus.UNAUTHORIZED, Message.USER_NOT_HAVE_FEATURE);
			}
			Date now = new Date();
			requestForLeave.setApprovedBy(currUser);
			requestForLeave.setApprovedAt(now);
		}

		requestForLeaveRepository.save(requestForLeave);

		Common.sendNotification(notificationRepository,
								mailSender,
								requestForLeave.getCreatedBy(),
								currUser,
								title,
								content);

		return new SimpleResponse();
	}

	private boolean isManager(User userWantToCheck, User userCreateRequest) {
		return userWantToCheck.getId().equals(userCreateRequest.getUnit().getManagerId());
	}

	private RequestForLeave mapToEntity(CreateRequestForLeaveRequest request) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		Date date;
		try {
			date = sdf.parse(request.getDate());
		} catch (ParseException e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.TIME_INVALID_FORMAT_DD_MM_YYYY);
		}

		return RequestForLeave.builder()
							  .date(date)
							  .note(request.getNote())
							  .shiftType(request.getShiftType())
							  .build();
	}

	private RequestForLeaveResponse mapToDTO(RequestForLeave entity) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

		return RequestForLeaveResponse.builder()
									  .date(sdf.format(entity.getDate()))
									  .note(entity.getNote())
									  .shiftType(entity.getShiftType())
									  .createdBy(mapToDTO(entity.getCreatedBy()))
									  .createdAt(TimeHelper.plus7Hours(entity.getCreatedAt()))
									  .approvedBy(mapToDTO(entity.getApprovedBy()))
									  .approvedAt(entity.getApprovedAt() == null ?
												  null :
												  TimeHelper.plus7Hours(entity.getApprovedAt()))
									  .acceptedBy(mapToDTO(entity.getAcceptedBy()))
									  .acceptedAt(entity.getAcceptedAt() == null ?
												  null :
												  TimeHelper.plus7Hours(entity.getAcceptedAt()))
									  .rejectedBy(mapToDTO(entity.getRejectedBy()))
									  .rejectedAt(entity.getRejectedAt() == null ?
												  null :
												  TimeHelper.plus7Hours(entity.getRejectedAt()))
									  .build();
	}

	private SimpleStaffResponse mapToDTO(User entity) {
		if (entity == null) {
			return null;
		}
		return SimpleStaffResponse.builder()
								  .id(entity.getId())
								  .email(entity.getEmail())
								  .image(entity.getImage())
								  .name(entity.getName())
								  .phone(entity.getPhone())
								  .build();
	}
}
