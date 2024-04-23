package com.ciw.backend.entity;

import com.ciw.backend.entity.IdClass.UnitFeatureId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
		name = "unit_feature"
)
@IdClass(UnitFeatureId.class)
public class UnitFeature {
	@ManyToOne(fetch = FetchType.LAZY, targetEntity = Unit.class)
	@Id
	private Unit unit;

	@ManyToOne(fetch = FetchType.EAGER, targetEntity = Feature.class)
	@Id
	private Feature feature;
}
