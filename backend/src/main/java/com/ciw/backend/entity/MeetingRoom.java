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
		name = "meeting_room",
		uniqueConstraints = {@UniqueConstraint(columnNames = {"name"}, name = "Tên"),
							 @UniqueConstraint(columnNames = {"location"}, name = "Vị trí")}
)
public class MeetingRoom {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	@Length(min = 1, max = 50)
	private String name;

	@Column(nullable = false)
	@Length(min = 1, max = 50)
	private String location;
}
