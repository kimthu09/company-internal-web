package com.ciw.backend.entity.IdClass;

import com.ciw.backend.payload.calendar.DayOfWeek;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class UnitShiftId implements Serializable {
	private Long unit;
	private DayOfWeek dayOfWeek;
}
