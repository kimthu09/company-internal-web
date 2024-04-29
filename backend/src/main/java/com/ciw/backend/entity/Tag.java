package com.ciw.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
		name = "tag",
		uniqueConstraints = {@UniqueConstraint(
				columnNames = {"name"},
				name = "Tên"
		)}
)
public class Tag {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(
			nullable = false,
			unique = true
	)
	@Length(
			min = 1,
			max = 50
	)
	private String name;

	@Column(
			name = "number_post",
			nullable = false
	)
	private int numberPost = 0;

	@JsonIgnore
	@ManyToMany(
			mappedBy = "tags",
			fetch = FetchType.LAZY,
			cascade = CascadeType.MERGE
	)
	private Set<Post> posts;
}
