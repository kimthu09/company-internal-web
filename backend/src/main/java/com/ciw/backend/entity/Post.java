package com.ciw.backend.entity;

import com.ciw.backend.config.audit.SystemAuditorAwareImpl;
import com.ciw.backend.utils.converter.HashMapConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;
import java.util.Map;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
		name = "post"
)
@EntityListeners(SystemAuditorAwareImpl.class)
public class Post {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	@Length(
			min = 1,
			max = 100
	)
	private String title;

	@Column(nullable = false)
	@Length(
			min = 0,
			max = 200
	)
	private String description;

	@Convert(converter = HashMapConverter.class)
	@Column(columnDefinition = "text")
	private Map<String, Object> content;

	@Column(nullable = false)
	private String image;

	@ManyToOne
	@JoinColumn(
			name = "created_by",
			nullable = false,
			updatable = false
	)
	private User createdBy;

	@CreatedDate
	@Column(
			name = "created_at",
			nullable = false,
			updatable = false
	)
	private Date createdAt;

	@LastModifiedDate
	@Column(name = "updated_at")
	private Date updatedAt;

	@ManyToMany(cascade = CascadeType.MERGE)
	@JoinTable(
			name = "post_tag",
			joinColumns = @JoinColumn(name = "post_id"),
			inverseJoinColumns = @JoinColumn(name = "tag_id")
	)
	private Set<Tag> tags;
}