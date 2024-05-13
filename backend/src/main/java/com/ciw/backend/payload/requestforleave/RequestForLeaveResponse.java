package com.ciw.backend.payload.requestforleave;

import com.ciw.backend.payload.calendar.ShiftType;
import com.ciw.backend.payload.staff.SimpleStaffResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class RequestForLeaveResponse {
	@Schema(
			name = "id",
			example = "1"
	)
	private Long id;

	@Schema(
			name = "fromDate",
			example = "12/12/2000"
	)
	private String fromDate;

	@Enumerated(EnumType.STRING)
	@Schema(
			name = "fromShiftType",
			example = "DAY"
	)
	private ShiftType fromShiftType;

	@Schema(
			name = "toDate",
			example = "12/12/2000"
	)
	private String toDate;

	@Enumerated(EnumType.STRING)
	@Schema(
			name = "toShiftType",
			example = "DAY"
	)
	private ShiftType toShiftType;

	@Schema(
			name = "note",
			example = "Ghi chú"
	)
	private String note;

	private SimpleStaffResponse createdBy;

	@Schema(
			name = "createdAt",
			example = "2024-04-16 05:20:42"
	)
	private Date createdAt;

	private SimpleStaffResponse approvedBy;

	@Schema(
			name = "approvedAt",
			example = "2024-04-16 05:20:42"
	)
	private Date approvedAt;

	private SimpleStaffResponse acceptedBy;

	@Schema(
			name = "acceptedAt",
			example = "2024-04-16 05:20:42"
	)
	private Date acceptedAt;

	private SimpleStaffResponse rejectedBy;

	@Schema(
			name = "rejectedAt",
			example = "2024-04-16 05:20:42"
	)
	private Date rejectedAt;
}
