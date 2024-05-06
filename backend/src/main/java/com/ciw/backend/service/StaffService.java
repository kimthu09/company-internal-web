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
import com.ciw.backend.payload.unit.SimpleUnitWithoutManagerResponse;
import com.ciw.backend.payload.user.*;
import com.ciw.backend.repository.UnitRepository;
import com.ciw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
	public UserResponse createStaff(CreateUserRequest request) {
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

	private void handleImage(CreateUserRequest request) {
		if (request.getImage().isEmpty()) {
			request.setImage(ApplicationConst.DEFAULT_AVATAR);
		}
	}

	@Transactional
	public UserResponse updateStaff(Long userId, UpdateUserRequest request) {
		User user = Common.findUserById(userId, userRepository);

		Common.updateIfNotNull(request.getName(), user::setName);
		Common.updateIfNotNull(request.getPhone(), user::setPhone);
		Common.updateIfNotNull(request.getDob(), user::setDob);
		Common.updateIfNotNull(request.getAddress(), user::setAddress);
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

		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String email = userDetails.getUsername();

		if (user.getEmail().equals(email)) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.User.CAN_NOT_DELETE_YOURSELF);
		} else if (user.getEmail().equals(ApplicationConst.ADMIN_EMAIL)) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.User.CAN_NOT_DELETE_ADMIN);
		}

		userRepository.deleteUserById(userId);

		deleteUnit(userId, user.getUnit());

		return new SimpleResponse();
	}


	@Transactional
	public ListResponse<UserResponse, UserFilter> getUsers(AppPageRequest page, UserFilter filter) {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String email = userDetails.getUsername();

		Pageable pageable = PageRequest.of(page.getPage() - 1,
										   page.getLimit(),
										   Sort.by(Sort.Direction.DESC, "name"));
		Specification<User> spec = filterStaffs(filter);

		Page<User> userPage = userRepository.findAllNotDeletedAndNotYourself(spec, pageable, email);

		List<User> users = userPage.getContent();

		List<UserResponse> data = users.stream().map(this::mapToDTO).toList();

		return ListResponse.<UserResponse, UserFilter>builder()
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
	public UserResponse getUser(Long id) {
		User user = Common.findUserById(id, userRepository);

		return mapToDTO(user);
	}

	private Specification<User> filterStaffs(UserFilter filter) {
		Specification<User> spec = Specification.where(null);
		if (filter.getName() != null) {
			spec = UserSpecs.hasName(filter.getName());
		}
		if (filter.getEmail() != null) {
			spec = spec.and(UserSpecs.hasEmail(filter.getEmail()));
		}
		if (filter.getPhone() != null) {
			spec = spec.and(UserSpecs.hasPhone(filter.getPhone()));
		}
		if (filter.getUnit() != null) {
			spec = spec.and(UserSpecs.hasUnitName(filter.getUnit()));
		}
		if (filter.getUnitId() != null) {
			spec = spec.and(UserSpecs.hasUnitId(filter.getUnitId()));
		}
		if (filter.getMale() != null) {
			spec = spec.and(UserSpecs.isMale(filter.getMale()));
		}
		if (filter.getMonthDOB() != null) {
			spec = spec.and(UserSpecs.hasDOBinMonth(filter.getMonthDOB()));
		}
		if (filter.getYearDOB() != null) {
			spec = spec.and(UserSpecs.hasDOBinYear(filter.getYearDOB()));
		}
		return spec;
	}

	private UserResponse mapToDTO(User user) {
		return UserResponse.builder()
						   .id(user.getId())
						   .name(user.getName())
						   .email(user.getEmail())
						   .unit(mapToSimpleUnitWithoutManager(user.getUnit()))
						   .image(user.getImage())
						   .phone(user.getPhone())
						   .dob(user.getDob())
						   .address(user.getAddress())
						   .male(user.isMale())
						   .build();
	}

	private SimpleUnitWithoutManagerResponse mapToSimpleUnitWithoutManager(Unit unit) {
		return SimpleUnitWithoutManagerResponse.builder()
											   .id(unit.getId())
											   .name(unit.getName())
											   .numberStaffs(unit.getNumberStaffs())
											   .build();
	}

	private User mapToEntity(CreateUserRequest request) {
		return User.builder()
				   .name(request.getName())
				   .email(request.getEmail())
				   .address(request.getAddress())
				   .dob(request.getDob())
				   .phone(request.getPhone())
				   .image(request.getImage())
				   .male(request.getMale())
				   .build();
	}
}
