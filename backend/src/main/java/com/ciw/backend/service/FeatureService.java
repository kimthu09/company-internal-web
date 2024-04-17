package com.ciw.backend.service;

import com.ciw.backend.entity.Feature;
import com.ciw.backend.payload.SimpleListResponse;
import com.ciw.backend.payload.feature.FeatureResponse;
import com.ciw.backend.repository.FeatureRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeatureService {
	private final FeatureRepository featureRepository;
	private final ObjectMapper objectMapper;

	@Transactional
	public SimpleListResponse<FeatureResponse> getAllFeatures() {
		List<FeatureResponse> features = featureRepository.findAll().stream().map(this::mapToDTO).toList();
		return new SimpleListResponse<>(features);
	}

	private Feature mapToEntity(FeatureResponse featureResponse) {
		return objectMapper.convertValue(featureResponse, Feature.class);
	}

	private FeatureResponse mapToDTO(Feature feature) {
		return objectMapper.convertValue(feature, FeatureResponse.class);
	}
}
