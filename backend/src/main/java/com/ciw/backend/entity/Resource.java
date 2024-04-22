package com.ciw.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
		name = "resource",
		uniqueConstraints = {@UniqueConstraint(columnNames = {"name"}, name = "Tên")}
)
public class Resource {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	@Length(min = 1, max = 50)
	private String name;
}
