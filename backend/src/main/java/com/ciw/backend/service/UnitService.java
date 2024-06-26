package com.ciw.backend.service;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.Feature;
import com.ciw.backend.entity.Unit;
import com.ciw.backend.entity.UnitFeature;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.feature.FeatureResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.staff.SimpleStaffResponse;
import com.ciw.backend.payload.unit.*;
import com.ciw.backend.repository.FeatureRepository;
import com.ciw.backend.repository.UnitFeatureRepository;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UnitService {
	private final UnitRepository unitRepository;
	private final UserRepository userRepository;
	private final FeatureRepository featureRepository;
	private final UnitFeatureRepository unitFeatureRepository;

	@Transactional
	public ListResponse<UnitWithManagerNumStaffResponse, UnitFilter> getUnits(AppPageRequest page, UnitFilter filter) {
		Pageable pageable = PageRequest.of(page.getPage() - 1, page.getLimit(), Sort.by(Sort.Direction.DESC, "name"));
		Specification<Unit> spec = filterUnits(filter);

		Page<Unit> unitPage = unitRepository.findAll(spec, pageable);

		List<Unit> units = unitPage.getContent();

		List<UnitWithManagerNumStaffResponse> data = units.stream().map(this::mapToSimpleDTO).toList();

		return ListResponse.<UnitWithManagerNumStaffResponse, UnitFilter>builder()
						   .data(data)
						   .appPageResponse(AppPageResponse.builder()
														   .index(page.getPage())
														   .limit(page.getLimit())
														   .totalPages(unitPage.getTotalPages())
														   .totalElements(unitPage.getTotalElements())
														   .build())
						   .filter(filter)
						   .build();
	}

	private Specification<Unit> filterUnits(UnitFilter filter) {
		Specification<Unit> spec = UnitSpecs.notIncludeAdmin();
		if (filter.getName() != null) {
			spec = spec.and(UnitSpecs.hasName(filter.getName()));
		}
		if (filter.getManager() != null) {
			List<Long> managerIds = userRepository.findByNameContains(filter.getManager())
												  .stream()
												  .map(User::getId)
												  .toList();
			spec = spec.and(UnitSpecs.hasManager(managerIds));
		}
		return spec;
	}

	@Transactional
	public UnitResponse getUnit(Long id) {
		Unit unit = Common.findUnitById(id, unitRepository);
		if (unit.getName().equals(ApplicationConst.ADMIN_UNIT_NAME)) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.Unit.ADMIN_UNIT_CAN_NOT_BE_INCLUDED);
		}

		List<User> staffs = userRepository.findByUnitIdAndNotDeleted(unit.getId());

		return mapToDTO(unit, staffs);
	}

	@Transactional
	public UnitResponse createUnit(CreateUnitRequest request) {
		Unit unit = mapToEntity(request);
		List<FeatureResponse> features = getFeatureExcludeAdminResponses(request.getFeatures());

		Unit savedUnit = unitRepository.save(unit);

		List<UnitFeature> unitFeatures = getUnitFeatures(unit, features);
		unitFeatureRepository.saveAll(unitFeatures);

		return mapToDTO(features, savedUnit);
	}

	private List<UnitFeature> getUnitFeatures(Unit unit, List<FeatureResponse> features) {
		List<UnitFeature> res = new ArrayList<>();
		for (FeatureResponse featureResponse : features) {
			if (!featureResponse.isHas()) {
				continue;
			}
			Feature feature = Feature.builder()
									 .id(featureResponse.getId())
									 .code(featureResponse.getCode())
									 .name(featureResponse.getName())
									 .build();
			res.add(UnitFeature.builder().feature(feature).unit(unit).build());
		}
		return res;
	}

	@Transactional
	public UnitWithManagerNumStaffResponse updateUnit(Long unitId, UpdateUnitRequest request) {
		Unit unit = Common.findUnitById(unitId, unitRepository);
		if (unit.getName().equals(ApplicationConst.ADMIN_UNIT_NAME)) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.Unit.ADMIN_UNIT_CAN_NOT_BE_INCLUDED);
		}
		Common.updateIfNotNull(request.getName(), unit::setName);
		if (request.getManagerId() != null) {
			Optional<Unit> existManagerUnit = unitRepository.findByManagerId(request.getManagerId());

			if (existManagerUnit.isPresent() && !existManagerUnit.get().getId().equals(unitId)) {
				throw new AppException(HttpStatus.BAD_REQUEST, Message.Unit.UNIT_MANAGER_EXIST);
			} else {
				Common.updateIfNotNull(request.getManagerId(), unit::setManagerId);
			}
		}
		Unit savedUnit = unitRepository.save(unit);
		if (request.getFeatures() != null) {
			List<FeatureResponse> features = getFeatureExcludeAdminResponses(request.getFeatures());

			List<UnitFeature> unitFeatures = getUnitFeatures(savedUnit, features);
			Set<UnitFeature> existingUnitFeatures = savedUnit.getUnitFeatures();
			existingUnitFeatures.clear();

			existingUnitFeatures.addAll(unitFeatures);
			unitRepository.save(savedUnit);
		}
		return mapToSimpleDTO(savedUnit);
	}

	@Transactional
	public SimpleResponse deleteUnit(Long unitId) {
		Unit unit = Common.findUnitById(unitId, unitRepository);
		if (unit.getName().equals(ApplicationConst.ADMIN_UNIT_NAME)) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.Unit.ADMIN_UNIT_CAN_NOT_BE_INCLUDED);
		}
		if (unit.getNumberStaffs() > 0) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.Unit.UNIT_STILL_HAVE_STAFFS_CAN_NOT_DELETE);
		}

		unitRepository.delete(unit);

		return new SimpleResponse();
	}

	private UnitWithManagerNumStaffResponse mapToSimpleDTO(Unit unit) {
		if (unit.getManagerId() == null) {
			return UnitWithManagerNumStaffResponse.builder()
												  .id(unit.getId())
												  .name(unit.getName())
												  .numberStaffs(unit.getNumberStaffs())
												  .build();
		}
		User manager = Common.findUserById(unit.getManagerId(), userRepository);
		return UnitWithManagerNumStaffResponse.builder()
											  .id(unit.getId())
											  .name(unit.getName())
											  .manager(mapToSimpleUser(manager))
											  .numberStaffs(unit.getNumberStaffs())
											  .build();
	}

	private Unit mapToEntity(CreateUnitRequest request) {
		return Unit.builder().name(request.getName()).build();
	}

	private UnitResponse mapToDTO(List<FeatureResponse> featureResponses, Unit unit, List<User> staffs) {
		if (unit.getManagerId() == null) {
			return UnitResponse.builder()
							   .id(unit.getId())
							   .name(unit.getName())
							   .staffs(staffs.stream().map(this::mapToSimpleUser).toList())
							   .features(featureResponses)
							   .numberStaffs(unit.getNumberStaffs())
							   .build();
		}
		User manager = Common.findUserById(unit.getManagerId(), userRepository);
		return UnitResponse.builder()
						   .id(unit.getId())
						   .name(unit.getName())
						   .manager(mapToSimpleUser(manager))
						   .staffs(staffs.stream().map(this::mapToSimpleUser).toList())
						   .features(featureResponses)
						   .numberStaffs(unit.getNumberStaffs())
						   .build();
	}

	private UnitResponse mapToDTO(List<FeatureResponse> featureResponses, Unit unit) {
		return mapToDTO(featureResponses, unit, new ArrayList<>());
	}

	private UnitResponse mapToDTO(Unit unit, List<User> staffs) {
		return mapToDTO(getFeatureExcludeAdminResponses(unit.getUnitFeatures()
															.stream()
															.map(unitFeature -> unitFeature.getFeature().getId())
															.toList()),
						unit,
						staffs);
	}

	private SimpleStaffResponse mapToSimpleUser(User user) {
		return SimpleStaffResponse.builder()
								  .id(user.getId())
								  .name(user.getName())
								  .email(user.getEmail())
								  .phone(user.getPhone())
								  .image(user.getImage())
								  .build();
	}

	private List<FeatureResponse> getFeatureExcludeAdminResponses(List<Long> featureIds) {
		return Common.getFeatureResponse(featureIds, false, featureRepository);
	}

	private List<FeatureResponse> getFeatureIncludeAdminResponses(List<Long> featureIds) {
		return Common.getFeatureResponse(featureIds, false, featureRepository);
	}
}
