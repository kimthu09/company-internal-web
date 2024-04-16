package com.ciw.backend.entity;

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
public class UnitFeature {
	@Id
	@ManyToOne(fetch = FetchType.EAGER, targetEntity = Unit.class)
	private Unit unit;
	@Id
	@ManyToOne(fetch = FetchType.EAGER, targetEntity = Feature.class)
	private Feature feature;
}
