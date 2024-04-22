package com.ciw.backend.entity;

import com.ciw.backend.payload.calendar.ShiftType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
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
		name = "resource_calendar"
)
@EntityListeners(AuditingEntityListener.class)
public class ResourceCalendar {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "date", nullable = false)
	private Date date;

	@ManyToOne
	@JoinColumn(name = "booked_by", nullable = false, updatable = false)
	private User bookedBy;

	@Enumerated(EnumType.STRING)
	@Column(name = "shift_type", nullable = false)
	private ShiftType shiftType;

	@ManyToOne
	@JoinColumn(name = "resource_id", nullable = false, updatable = false)
	private Resource resource;

	@ManyToOne
	@JoinColumn(name = "created_by", nullable = false, updatable = false)
	@CreatedBy
	private User createdBy;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Date createdAt;
}
