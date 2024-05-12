package com.ciw.backend.entity;

import com.ciw.backend.payload.calendar.ShiftType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
		name = "resource_calendar",
		uniqueConstraints = {
				@UniqueConstraint(
						columnNames = {"date", "shift_type", "resource_id"},
						name = "Bảng ghi"
				)
		}
)
@EntityListeners(AuditingEntityListener.class)
public class ResourceCalendar {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(
			name = "date",
			nullable = false
	)
	private Date date;

	@Enumerated(EnumType.STRING)
	@Column(
			name = "shift_type",
			nullable = false
	)
	private ShiftType shiftType;

	@ManyToOne
	@JoinColumn(
			name = "resource_id",
			nullable = false,
			updatable = false
	)
	private Resource resource;

	@Column(
			nullable = false
	)
	@Length(
			min = 1,
			max = 200
	)
	private String note;

	@ManyToOne
	@JoinColumn(
			name = "created_by",
			nullable = false,
			updatable = false
	)
	@CreatedBy
	private User createdBy;
}
