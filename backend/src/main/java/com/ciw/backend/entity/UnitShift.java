package com.ciw.backend.entity;

import com.ciw.backend.entity.IdClass.UnitShiftId;
import com.ciw.backend.payload.calendar.DayOfWeek;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
		name = "unit_shift"
)
@IdClass(UnitShiftId.class)
public class UnitShift {
	@ManyToOne(targetEntity = User.class, fetch = FetchType.LAZY)
	@JoinColumn(name = "unit_id", nullable = false)
	@Id
	private Unit unit;

	@Id
	@Enumerated(EnumType.STRING)
	@Column(name = "day_of_week")
	private DayOfWeek dayOfWeek;

	@Column(name = "is_has_drawn_shift", nullable = false)
	private boolean isHasDrawnShift = false;

	@Column(name = "is_has_morning_shift", nullable = false)
	private boolean isHasMorningShift = false;

	@Column(name = "is_has_evening_shift", nullable = false)
	private boolean isHasEveningShift = false;

	@Column(name = "is_has_night_shift", nullable = false)
	private boolean isHasNightShift = false;
}
