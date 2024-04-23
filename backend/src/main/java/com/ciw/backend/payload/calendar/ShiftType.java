package com.ciw.backend.payload.calendar;

public enum ShiftType {
	DRAWN, MORNING, EVENING, NIGHT;

	public static ShiftType MIN() {
		return DRAWN;
	}

	public static ShiftType MAX() {
		return NIGHT;
	}
}
