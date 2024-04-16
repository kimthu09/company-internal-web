package com.ciw.backend.payload.post;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
	@Schema(name = "title", example = "Tiêu đề bài post")
	@Length(min = 1, max = 100, message = Message.Post.POST_TITLE_VALIDATE)
	private String title;

	@Schema(name = "description", example = "Mô tả bài post")
	@Length(min = 0, max = 200, message = Message.Post.POST_DESCRIPTION_VALIDATE)
	private String description;

	@Schema(name = "content", example = "{\n" +
										"   \"time\": 1550476186479,\n" +
										"   \"blocks\": [\n" +
										"      {\n" +
										"         \"id\": \"oUq2g_tl8y\",\n" +
										"         \"type\": \"header\",\n" +
										"         \"data\": {\n" +
										"            \"text\": \"Editor.js\",\n" +
										"            \"level\": 2\n" +
										"         }\n" +
										"      },\n" +
										"      {\n" +
										"         \"id\": \"zbGZFPM-iI\",\n" +
										"         \"type\": \"paragraph\",\n" +
										"         \"data\": {\n" +
										"            \"text\": \"Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration.\"\n" +
										"         }\n" +
										"      },\n" +
										"      {\n" +
										"         \"id\": \"qYIGsjS5rt\",\n" +
										"         \"type\": \"header\",\n" +
										"         \"data\": {\n" +
										"            \"text\": \"Key features\",\n" +
										"            \"level\": 3\n" +
										"         }\n" +
										"      },\n" +
										"      {\n" +
										"         \"id\": \"XV87kJS_H1\",\n" +
										"         \"type\": \"list\",\n" +
										"         \"data\": {\n" +
										"            \"style\": \"unordered\",\n" +
										"            \"items\": [\n" +
										"               \"It is a block-styled editor\",\n" +
										"               \"It returns clean data output in JSON\",\n" +
										"               \"Designed to be extendable and pluggable with a simple API\"\n" +
										"            ]\n" +
										"         }\n" +
										"      },\n" +
										"      {\n" +
										"         \"id\": \"AOulAjL8XM\",\n" +
										"         \"type\": \"header\",\n" +
										"         \"data\": {\n" +
										"            \"text\": \"What does it mean «block-styled editor»\",\n" +
										"            \"level\": 3\n" +
										"         }\n" +
										"      },\n" +
										"      {\n" +
										"         \"id\": \"cyZjplMOZ0\",\n" +
										"         \"type\": \"paragraph\",\n" +
										"         \"data\": {\n" +
										"            \"text\": \"Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class=\\\"cdx-marker\\\">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor's Core.\"\n" +
										"         }\n" +
										"      }\n" +
										"   ],\n" +
										"   \"version\": \"2.8.1\"\n" +
										"}")
	@NotEmpty(message = Message.Post.POST_CONTENT_EMPTY)
	private Map<String, Object> content;

	@Schema(name = "image",
			example = ApplicationConst.DEFAULT_POST_IMAGE,
			description = "Nếu không có hình ảnh, BE sẽ lấy ảnh mặc định")
	private String image;

	@Schema(name = "attachments", description = "Nếu không có tệp đính kèm, cần truyền []")
	@NotEmpty(message = Message.Post.POST_CONTENT_EMPTY)
	private List<PostAttachment> attachments;

	@Schema(name = "tags", example = "[1, 2, 3]", description = "Nếu không có tag, cần truyền []")
	private Set<Long> tags;
}
