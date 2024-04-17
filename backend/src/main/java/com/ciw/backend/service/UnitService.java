package com.ciw.backend.service;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.Unit;
import com.ciw.backend.entity.UnitFeature;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.feature.FeatureResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.unit.*;
import com.ciw.backend.payload.user.SimpleUserResponse;
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

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UnitService {
	private final UnitRepository unitRepository;
	private final UserRepository userRepository;
	private final UnitFeatureRepository unitFeatureRepository;

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
			spec = spec.and(UnitSpecs.hasManager(filter.getManager()));
		}
		return spec;
	}

	public UnitResponse getUnit(Long id) {
		Unit unit = unitRepository.findById(id)
								  .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																	  Message.Unit.UNIT_NOT_EXIST));

		List<User> staffs = userRepository.findByUnitId(unit.getId());

		return mapToDTO(unit, staffs);
	}

	public UnitResponse createUnit(CreateUnitRequest request) {
		Unit unit = mapToEntity(request);
		unit.setUnitFeatures(findUnitFeatures(request.getFeatures()));
		if (request.getManager() != null) {
			unit.setManager(findManager(request.getManager()));
		}

		return mapToDTO(unitRepository.save(unit));
	}

	private Set<UnitFeature> findUnitFeatures(List<Long> featureIds) {
		Set<UnitFeature> features = new HashSet<>();
		for (Long featureId : featureIds) {
			features.add(unitFeatureRepository.findFirstByFeatureId(featureId)
								 .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																	 Message.Feature.FEATURE_NOT_EXIST)

								 ));
		}
		return features;
	}

	private User findManager(Long id) {
		return userRepository.findById(id)
							 .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, Message.User.USER_NOT_EXIST));
	}

	private SimpleUnitResponse mapToSimpleDTO(Unit unit) {
		return SimpleUnitResponse.builder()
								 .id(unit.getId())
								 .name(unit.getName())
								 .manager(mapToSimpleUser(unit.getManager()))
								 .build();
	}

	private Unit mapToEntity(CreateUnitRequest request) {
		return Unit.builder().name(request.getName()).build();
	}

	private UnitResponse mapToDTO(Unit unit, List<User> staffs) {
		return UnitResponse.builder()
						   .id(unit.getId())
						   .name(unit.getName())
						   .manager(mapToSimpleUser(unit.getManager()))
						   .staffs(staffs.stream().map(this::mapToSimpleUser).toList())
						   .features(unit.getUnitFeatures().stream().map(this::mapToFeatureResponse).toList())
						   .build();
	}

	private UnitResponse mapToDTO(Unit unit) {
		return mapToDTO(unit, new ArrayList<>());
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

	private FeatureResponse mapToFeatureResponse(UnitFeature unitFeature) {
		return FeatureResponse.builder()
							  .id(unitFeature.getFeature().getId())
							  .name(unitFeature.getFeature().getName())
							  .build();
	}
}
