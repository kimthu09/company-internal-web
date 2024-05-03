package com.ciw.backend.service;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.*;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.feature.FeatureResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.unit.*;
import com.ciw.backend.payload.user.SimpleUserResponse;
import com.ciw.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UnitService {
	private final UnitRepository unitRepository;
	private final UserRepository userRepository;
	private final FeatureRepository featureRepository;
	private final UnitFeatureRepository unitFeatureRepository;
	private final UnitShiftRepository unitShiftRepository;
	private final UnitShiftAbsentRepository unitShiftAbsentRepository;

	@Transactional
	public ListResponse<SimpleUnitResponse, UnitFilter> getUnits(AppPageRequest page, UnitFilter filter) {
		Pageable pageable = PageRequest.of(page.getPage() - 1, page.getLimit(), Sort.by(Sort.Direction.DESC, "name"));
		Specification<Unit> spec = filterUnits(filter);

		Page<Unit> unitPage = unitRepository.findAll(spec, pageable);

		List<Unit> units = unitPage.getContent();

		List<SimpleUnitResponse> data = units.stream().map(this::mapToSimpleDTO).toList();

		return ListResponse.<SimpleUnitResponse, UnitFilter>builder()
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
		Specification<Unit> spec = Specification.where(null);
		if (filter.getName() != null) {
			spec = UnitSpecs.hasName(filter.getName());
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

		List<User> staffs = userRepository.findByUnitIdAndNotDeleted(unit.getId());

		return mapToDTO(unit, staffs);
	}

	@Transactional
	public UnitResponse createUnit(CreateUnitRequest request) {
		Unit unit = mapToEntity(request);
		List<FeatureResponse> features = getFeatureResponses(request.getFeatures());

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
			Feature feature = Feature.builder().id(featureResponse.getId()).name(featureResponse.getName()).build();
			res.add(UnitFeature.builder().feature(feature).unit(unit).build());
		}
		return res;
	}

	@Transactional
	public SimpleUnitResponse updateUnit(Long unitId, UpdateUnitRequest request) {
		Unit unit = Common.findUnitById(unitId, unitRepository);
		Common.updateIfNotNull(request.getName(), unit::setName);
		if (request.getManagerId() != null) {
			Optional<Unit> existManagerUnit = unitRepository.findByManagerId(request.getManagerId());

			User manager = userRepository.findById(request.getManagerId())
										 .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																			 Message.Unit.UNIT_MANAGER_NOTEXIST));

			if (existManagerUnit.isPresent() && existManagerUnit.get().getId() != unitId) {
				throw new AppException(HttpStatus.BAD_REQUEST, Message.Unit.UNIT_MANAGER_EXIST);
			} else {
				Common.updateIfNotNull(request.getManagerId(), unit::setManagerId);
			}
		}
		Unit savedUnit = unitRepository.save(unit);
		if (request.getFeatures() != null) {
			List<FeatureResponse> features = getFeatureResponses(request.getFeatures());

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
		if (unit.getNumberStaffs() > 0) {
		    throw new AppException(HttpStatus.BAD_REQUEST, Message.Unit.UNIT_STILL_HAVE_STAFFS_CAN_NOT_DELETE);
		}

		List<UnitShift> unitShifts = unitShiftRepository.findByUnitId(unitId);
		unitShiftRepository.deleteAll(unitShifts);

		List<UnitShiftAbsent> unitShiftAbsents = unitShiftAbsentRepository.findByUnitId(unitId);
		unitShiftAbsentRepository.deleteAll(unitShiftAbsents);

		unitRepository.delete(unit);

		return new SimpleResponse();
	}

	private SimpleUnitResponse mapToSimpleDTO(Unit unit) {
		if (unit.getManagerId() == null) {
			return SimpleUnitResponse.builder()
									 .id(unit.getId())
									 .name(unit.getName())
									 .numberStaffs(unit.getNumberStaffs())
									 .build();
		}
		User manager = Common.findUserById(unit.getManagerId(), userRepository);
		return SimpleUnitResponse.builder()
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
		return mapToDTO(getFeatureResponses(unit.getUnitFeatures()
												.stream()
												.map(unitFeature -> unitFeature.getFeature().getId())
												.toList()),
						unit,
						staffs);
	}

	private SimpleUserResponse mapToSimpleUser(User user) {
		return SimpleUserResponse.builder()
								 .id(user.getId())
								 .name(user.getName())
								 .email(user.getEmail())
								 .phone(user.getPhone())
								 .image(user.getImage())
								 .build();
	}

	private List<FeatureResponse> getFeatureResponses(List<Long> featureIds) {
		return Common.getFeatureResponse(featureIds, featureRepository);
	}
}
