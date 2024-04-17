package com.ciw.backend.service;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.Unit;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.unit.SimpleUnitWithoutManagerResponse;
import com.ciw.backend.payload.user.CreateUserRequest;
import com.ciw.backend.payload.user.UserFilter;
import com.ciw.backend.payload.user.UserResponse;
import com.ciw.backend.payload.user.UserSpecs;
import com.ciw.backend.repository.UnitRepository;
import com.ciw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffService {
	private final UserRepository userRepository;
	private final UnitRepository unitRepository;

	public UserResponse createUser(CreateUserRequest request) {
		handleImage(request);
		User user = mapToEntity(request);
		user.setDeleted(false);
		user.setUnit(findUnit(request.getUnit()));
		user.setPassword(ApplicationConst.DEFAULT_PASSWORD);

		return mapToDTO(userRepository.save(user));
	}

	private void handleImage(CreateUserRequest request) {
		if (request.getImage().isEmpty()) {
			request.setImage(ApplicationConst.DEFAULT_AVATAR);
		}
	}

	private Unit findUnit(Long unitId) {
		return unitRepository.findById(unitId)
							 .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, Message.Unit.UNIT_NOT_EXIST));
	}

	public ListResponse<UserResponse, UserFilter> getUsers(AppPageRequest page, UserFilter filter) {
		Pageable pageable = PageRequest.of(page.getPage() - 1,
										   page.getLimit(),
										   Sort.by(Sort.Direction.DESC, "name"));
		Specification<User> spec = filterStaffs(filter);

		Page<User> userPage = userRepository.findAll(spec, pageable);

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

	public UserResponse getUser(Long id) {
		User user = userRepository.findById(id)
								  .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																	  Message.User.USER_NOT_EXIST));

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
			spec = spec.and(UserSpecs.hasUnit(filter.getUnit()));
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
						   .build();
	}

	private SimpleUnitWithoutManagerResponse mapToSimpleUnitWithoutManager(Unit unit) {
		return SimpleUnitWithoutManagerResponse.builder()
											   .id(unit.getId())
											   .name(unit.getName())
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
				   .build();
	}
}
