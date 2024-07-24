package com.ciw.backend.service;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.Unit;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.staff.*;
import com.ciw.backend.payload.unit.UnitWithNumStaffResponse;
import com.ciw.backend.repository.UnitRepository;
import com.ciw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffService {
	private final UserRepository userRepository;
	private final UnitRepository unitRepository;
	private final PasswordEncoder passwordEncoder;

	@Transactional
	public StaffResponse createStaff(CreateStaffRequest request) {
		handleImage(request);
		User user = mapToEntity(request);
		user.setDeleted(false);

		user.setPassword(passwordEncoder.encode(ApplicationConst.DEFAULT_PASSWORD));

		Unit unit = Common.findUnitById(request.getUnit(), unitRepository);
		user.setUnit(unit);

		unit.setNumberStaffs(unit.getNumberStaffs() + 1);
		unitRepository.save(unit);

		return mapToDTO(userRepository.save(user));
	}

	private void handleImage(CreateStaffRequest request) {
		if (request.getImage().isEmpty()) {
			request.setImage(ApplicationConst.DEFAULT_AVATAR);
		}
	}

	@Transactional
	public StaffResponse updateStaff(Long userId, UpdateStaffRequest request) {
		User user = Common.findUserById(userId, userRepository);
		if (user.getEmail().equals(ApplicationConst.ADMIN_EMAIL)) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.User.CAN_NOT_REACH_ADMIN);
		}

		Common.updateIfNotNull(request.getName(), user::setName);
		Common.updateIfNotNull(request.getPhone(), user::setPhone);
		Common.updateIfNotNull(request.getDob(), user::setDob);
		Common.updateIfNotNull(request.getAddress(), user::setAddress);
		Common.updateIfNotNull(request.getUserIdentity(), user::setUserIdentity);
		Common.updateIfNotNull(request.getImage(), user::setImage);
		Common.updateIfNotNull(request.getMale(), user::setMale);
		if (request.getUnit() != null) {
			updateUnit(user, user.getUnit(), request.getUnit());
		}

		return mapToDTO(userRepository.save(user));
	}

	private void updateUnit(User user, Unit currentUnit, Long updatedUnitId) {
		addUnit(user, updatedUnitId);
		deleteUnit(user.getId(), currentUnit);
	}

	private void addUnit(User user, Long updatedUnit) {
		Unit unit = Common.findUnitById(updatedUnit, unitRepository);

		user.setUnit(unit);
		unit.setNumberStaffs(unit.getNumberStaffs() + 1);
		unitRepository.save(unit);
	}

	private void deleteUnit(Long userId, Unit unit) {
		unit.setNumberStaffs(unit.getNumberStaffs() - 1);
		if (unit.getManagerId() != null && unit.getManagerId().equals(userId)) {
			unit.setManagerId(null);
		}
		unitRepository.save(unit);
	}

	@Transactional
	public SimpleResponse deleteStaff(Long userId) {
		User user = Common.findUserById(userId, userRepository);
		if (user.getEmail().equals(ApplicationConst.ADMIN_EMAIL)) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.User.CAN_NOT_DELETE_ADMIN);
		}

		userRepository.deleteUserById(userId);

		deleteUnit(userId, user.getUnit());

		return new SimpleResponse();
	}

	@Transactional
	public ListResponse<StaffResponse, StaffFilter> getAllUser(AppPageRequest page, StaffFilter filter) {
		Pageable pageable = PageRequest.of(page.getPage() - 1,
										   page.getLimit(),
										   Sort.by(Sort.Direction.ASC, "name"));
		Specification<User> spec = filterStaffs(filter);

		Page<User> userPage = userRepository.findAll(spec, pageable);

		System.out.println("Done");
		return getListResponseFromPage(userPage, page, filter);
	}

	private ListResponse<StaffResponse, StaffFilter> getListResponseFromPage(Page<User> userPage,
																			 AppPageRequest page,
																			 StaffFilter filter) {
		List<User> users = userPage.getContent();

		List<StaffResponse> data = users.stream().map(this::mapToDTO).toList();

		return ListResponse.<StaffResponse, StaffFilter>builder()
						   .data(data)
						   .appPageResponse(AppPageResponse.builder()
														   .index(page.getPage())
														   .limit(page.getLimit())
														   .totalPages(userPage.getTotalPages())
														   .totalElements(userPage.getTotalElements())
														   .build())
						   .filter(filter)
						   .build();
	}


	@Transactional
	public ListResponse<StaffResponse, StaffFilter> getUsers(AppPageRequest page, StaffFilter filter) {
		Pageable pageable = PageRequest.of(page.getPage() - 1,
										   page.getLimit(),
										   Sort.by(Sort.Direction.ASC, "name"));
		Specification<User> spec = filterStaffs(filter);

		Page<User> userPage = userRepository.findAllNotDeletedAndNotAdmin(spec, pageable);

		return getListResponseFromPage(userPage, page, filter);
	}

	@Transactional
	public StaffResponse getUser(Long id) {
		User user = Common.findUserById(id, userRepository);
		if (user.getEmail().equals(ApplicationConst.ADMIN_EMAIL)) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.User.CAN_NOT_REACH_ADMIN);
		}

		return mapToDTO(user);
	}

	private Specification<User> filterStaffs(StaffFilter filter) {
		Specification<User> spec = Specification.where(null);
		if (filter.getName() != null) {
			spec = StaffSpecs.hasName(filter.getName());
		}
		if (filter.getEmail() != null) {
			spec = spec.and(StaffSpecs.hasEmail(filter.getEmail()));
		}
		if (filter.getPhone() != null) {
			spec = spec.and(StaffSpecs.hasPhone(filter.getPhone()));
		}
		if (filter.getUnit() != null) {
			spec = spec.and(StaffSpecs.hasUnitName(filter.getUnit()));
		}
		if (filter.getUnitId() != null) {
			spec = spec.and(StaffSpecs.hasUnitId(filter.getUnitId()));
		}
		if (filter.getMale() != null) {
			spec = spec.and(StaffSpecs.isMale(filter.getMale()));
		}
		if (filter.getMonthDOB() != null) {
			spec = spec.and(StaffSpecs.hasDOBinMonth(filter.getMonthDOB()));
		}
		if (filter.getYearDOB() != null) {
			spec = spec.and(StaffSpecs.hasDOBinYear(filter.getYearDOB()));
		}
		return spec;
	}

	private StaffResponse mapToDTO(User user) {
		return StaffResponse.builder()
							.id(user.getId())
							.name(user.getName())
							.email(user.getEmail())
							.unit(mapToSimpleUnitWithoutManager(user.getUnit()))
							.image(user.getImage())
							.phone(user.getPhone())
							.userIdentity(user.getUserIdentity())
							.dob(user.getDob())
							.address(user.getAddress())
							.male(user.isMale())
							.build();
	}

	private UnitWithNumStaffResponse mapToSimpleUnitWithoutManager(Unit unit) {
		if (unit == null) {
			return null;
		}
		return UnitWithNumStaffResponse.builder()
									   .id(unit.getId())
									   .name(unit.getName())
									   .numberStaffs(unit.getNumberStaffs())
									   .build();
	}

	private User mapToEntity(CreateStaffRequest request) {
		return User.builder()
				   .name(request.getName())
				   .email(request.getEmail())
				   .address(request.getAddress())
				   .dob(request.getDob())
				   .phone(request.getPhone())
				   .userIdentity(request.getUserIdentity())
				   .image(request.getImage())
				   .male(request.getMale())
				   .build();
	}
}
