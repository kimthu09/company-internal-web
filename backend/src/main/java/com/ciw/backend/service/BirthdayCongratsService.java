package com.ciw.backend.service;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.constants.BirthdayFeatureHelper;
import com.ciw.backend.entity.Post;
import com.ciw.backend.entity.Tag;
import com.ciw.backend.entity.User;
import com.ciw.backend.repository.PostRepository;
import com.ciw.backend.repository.TagRepository;
import com.ciw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BirthdayCongratsService {
	private final UserRepository userRepository;
	private final PostRepository postRepository;
	private final TagRepository tagRepository;

	private static Map<String, Object> generateFirstContent(int month, int year) {
		Map<String, Object> dataMap = new HashMap<>();
		dataMap.put("text",
					String.format("<b>Chúc mừng sinh nhật</b> tới nhân viên sinh vào <b>tháng %s năm %s</b>!",
								  month,
								  year));

		Map<String, Object> tunesMap = new HashMap<>();
		Map<String, Object> anyTuneNameMap = new HashMap<>();
		anyTuneNameMap.put("alignment", "left");
		tunesMap.put("anyTuneName", anyTuneNameMap);

		Map<String, Object> jsonObject = new HashMap<>();
		jsonObject.put("id", "qgZbJIXuke");
		jsonObject.put("type", "paragraph");
		jsonObject.put("data", dataMap);
		jsonObject.put("tunes", tunesMap);

		return jsonObject;
	}

	public static Map<String, Object> generateSecondContent(List<User> staffs) {
		List<Map<String, Object>> itemsList = new ArrayList<>();

		for (User staff : staffs) {
			Map<String, Object> itemMap = new HashMap<>();
			itemMap.put("content", String.format("<b>%s</b> - <i>%s</i>", staff.getName(), staff.getDob()));
			itemMap.put("checked", null);
			itemMap.put("items", new ArrayList<>());
			itemsList.add(itemMap);
		}

		Map<String, Object> dataMap = new HashMap<>();
		dataMap.put("style", "unordered");
		dataMap.put("items", itemsList);

		Map<String, Object> jsonObject = new HashMap<>();
		jsonObject.put("id", "CL9snXd2cl");
		jsonObject.put("type", "nestedchecklist");
		jsonObject.put("data", dataMap);

		return jsonObject;
	}

	private static Map<String, Object> generateThirdContent() {
		Map<String, Object> dataMap = new HashMap<>();
		dataMap.put("text",
					"Công ty chúng tôi muốn <b>gửi tới các bạn lời chúc tốt đẹp nhất</b>, kèm theo hy vọng rằng một năm mới sẽ mang lại nhiều thành công, sức khỏe, hạnh phúc và điều may mắn đến cho cuộc sống và sự nghiệp của mỗi người.");

		Map<String, Object> tunesMap = new HashMap<>();
		Map<String, Object> anyTuneNameMap = new HashMap<>();
		anyTuneNameMap.put("alignment", "left");
		tunesMap.put("anyTuneName", anyTuneNameMap);

		Map<String, Object> jsonObject = new HashMap<>();
		jsonObject.put("id", "nlvbJQZUan");
		jsonObject.put("type", "paragraph");
		jsonObject.put("data", dataMap);
		jsonObject.put("tunes", tunesMap);

		return jsonObject;
	}

	private static Map<String, Object> generateFourthContent() {
		Map<String, Object> dataMap = new HashMap<>();
		dataMap.put("text",
					"Hãy để chúng ta cùng nhau ấp ủ những mục tiêu mới, thách thức mới và thành tựu mới trong năm mới này. <b>Sinh nhật vui vẻ và hạnh phúc!</b>");

		Map<String, Object> tunesMap = new HashMap<>();
		Map<String, Object> anyTuneNameMap = new HashMap<>();
		anyTuneNameMap.put("alignment", "left");
		tunesMap.put("anyTuneName", anyTuneNameMap);

		Map<String, Object> jsonObject = new HashMap<>();
		jsonObject.put("id", "DcOmLfJrzs");
		jsonObject.put("type", "paragraph");
		jsonObject.put("data", dataMap);
		jsonObject.put("tunes", tunesMap);

		return jsonObject;
	}

	@Scheduled(cron = "0 0 0 * * ?")
	@Transactional
	public void createBirthdayCongrats() {
		LocalDate currDate = LocalDate.now();
		int currMonth = currDate.getMonthValue();
		int currYear = currDate.getYear();

		List<User> staffsHasBirthdayInMonth = userRepository.findAllNotDeletedAndHasBirthdayInMonth(currMonth);
		if (staffsHasBirthdayInMonth.isEmpty()) {
			return;
		}

		User admin = Common.findUserByEmail(ApplicationConst.ADMIN_EMAIL, userRepository);

		Post post = Post.builder()
						.title(String.format("Sinh nhật tháng %s năm %s", currMonth, currYear))
						.description(String.format("Chúc mừng sinh nhật tháng %s năm %s",
												   currMonth,
												   currYear))
						.image(BirthdayFeatureHelper.getBirthdayImagePath(currMonth))
						.content(createContent(currMonth, currYear, staffsHasBirthdayInMonth))
						.createdBy(admin)
						.build();

		Set<Tag> tags = new HashSet<>();
		Tag birthdayTag = Common.findTagById(ApplicationConst.BIRTHDAY_TAG_ID, tagRepository);
		tags.add(birthdayTag);
		birthdayTag.setNumberPost(birthdayTag.getNumberPost() + 1);
		tagRepository.save(birthdayTag);

		post.setTags(tags);

		postRepository.save(post);
	}

	private Map<String, Object> createContent(int month, int year, List<User> users) {
		Map<String, Object> content = new HashMap<>();

		content.put("time", Instant.now().toEpochMilli());
		content.put("version", "2.29.1");

		List<Map<String, Object>> blocks = new ArrayList<>();
		blocks.add(generateFirstContent(month, year));
		blocks.add(generateSecondContent(users));
		blocks.add(generateThirdContent());
		blocks.add(generateFourthContent());

		content.put("blocks", blocks);

		return content;
	}

}
