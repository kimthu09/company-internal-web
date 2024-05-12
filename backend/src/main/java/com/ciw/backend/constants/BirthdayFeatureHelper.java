package com.ciw.backend.constants;

public class BirthdayFeatureHelper {
	private static final String BIRTHDAY_IMAGE_PATH
			= "https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fbirthday%2F";
	private static final String SUFFIX_PATH = ".png?alt=media";

	public static String getBirthdayImagePath(int month) {
		return BIRTHDAY_IMAGE_PATH + month + SUFFIX_PATH;
	}
}
