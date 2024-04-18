package com.ciw.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
		name = "unit",
		uniqueConstraints = {@UniqueConstraint(columnNames = {"name"}, name = "Tên")}
)
public class Unit {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	@Length(min = 1, max = 100)
	private String name;

	@Column(name = "manager_id")
	private Long managerId;

	@OneToMany(fetch = FetchType.EAGER,
			   mappedBy = "unit",
			   cascade = CascadeType.ALL,
			   orphanRemoval = true,
			   targetEntity = UnitFeature.class)
	private Set<UnitFeature> unitFeatures;

	@Column(nullable = false)
	private int numberStaffs = 0;
}
