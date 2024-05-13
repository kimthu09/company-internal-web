package com.ciw.backend.entity;

import com.ciw.backend.payload.calendar.ShiftType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
		name = "request_for_leave",
		uniqueConstraints = {
				@UniqueConstraint(
						columnNames = {"date", "shift_type", "created_by"},
						name = "Bảng ghi"
				)
		}
)
public class RequestForLeave {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(
			name = "from_date",
			nullable = false
	)
	private Date fromDate;

	@Column(
			name = "to_date",
			nullable = false
	)
	private Date toDate;

	@Enumerated(EnumType.STRING)
	@Column(
			name = "from_shift_type",
			nullable = false
	)
	private ShiftType fromShiftType;

	@Enumerated(EnumType.STRING)
	@Column(
			name = "to_shift_type",
			nullable = false
	)
	private ShiftType toShiftType;

	@Column(
			nullable = false
	)
	@Length(
			min = 0,
			max = 200
	)
	private String note;

	@ManyToOne
	@JoinColumn(
			name = "created_by",
			nullable = false,
			updatable = false
	)
	private User createdBy;

	@Column(
			name = "created_at",
			nullable = false,
			updatable = false
	)
	private Date createdAt;

	@ManyToOne
	@JoinColumn(
			name = "approved_by",
			nullable = true
	)
	private User approvedBy;

	@Column(
			name = "approved_at",
			nullable = true
	)
	private Date approvedAt;

	@ManyToOne
	@JoinColumn(
			name = "accepted_by",
			nullable = true
	)
	private User acceptedBy;

	@Column(
			name = "accepted_at",
			nullable = true
	)
	private Date acceptedAt;

	@ManyToOne
	@JoinColumn(
			name = "rejected_by",
			nullable = true
	)
	private User rejectedBy;

	@Column(
			name = "rejected_at",
			nullable = true
	)
	private Date rejectedAt;
}
