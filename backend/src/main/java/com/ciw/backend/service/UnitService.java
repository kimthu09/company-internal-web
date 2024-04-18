package com.ciw.backend.service;

import com.ciw.backend.entity.Feature;
import com.ciw.backend.entity.Unit;
import com.ciw.backend.entity.UnitFeature;
import com.ciw.backend.entity.User;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.feature.FeatureResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.unit.*;
import com.ciw.backend.payload.user.SimpleUserResponse;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service @RequiredArgsConstructor public class UnitService {
	private final UnitRepository unitRepository;
	private final UserRepository userRepository;
	private final FeatureRepository featureRepository;
	private final UnitFeatureRepository unitFeatureRepository;

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

	@Transactional public UnitResponse getUnit(Long id) {
		Unit unit = Common.findUnitById(id, unitRepository);

		List<User> staffs = userRepository.findByUnitIdAndNotDeleted(unit.getId());

		return mapToDTO(unit, staffs);
	}

	@Transactional public UnitResponse createUnit(CreateUnitRequest request) {
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
