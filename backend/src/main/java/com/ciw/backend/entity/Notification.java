package com.ciw.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
		name = "notification"
)
@EntityListeners(AuditingEntityListener.class)
public class Notification {
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
	@Length(max = 200)
	private String description;

	@ManyToOne(
			targetEntity = User.class,
			fetch = FetchType.LAZY
	)
	@JoinColumn(
			name = "from_user",
			nullable = false
	)
	private User fromUser;

	@ManyToOne(
			targetEntity = User.class,
			fetch = FetchType.EAGER
	)
	@JoinColumn(
			name = "to_user",
			nullable = false
	)
	private User toUser;

	@CreatedDate
	@Column(
			name = "created_at",
			nullable = false,
			updatable = false
	)
	private Date createdAt;

	@Column(
			name = "seen",
			nullable = false
	)
	private boolean seen;
}
