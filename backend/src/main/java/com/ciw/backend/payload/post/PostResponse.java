package com.ciw.backend.payload.post;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.payload.staff.SimpleStaffResponse;
import com.ciw.backend.payload.tag.TagResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Map;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostResponse {
	@Schema(
			name = "id",
			example = "1"
	)
	private Long id;

	@Schema(
			name = "title",
			example = "Tiêu đề bài post"
	)
	private String title;

	@Schema(
			name = "description",
			example = "Bài post siêu hay. super hay. Nên đọc. <3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333"
	)
	private String description;

	@Schema(
			name = "content",
			example = "{\n" +
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
					  "}"
	)
	private Map<String, Object> content;

	@Schema(
			name = "image",
			example = ApplicationConst.DEFAULT_POST_IMAGE
	)
	private String image;

	@Schema(name = "createdBy")
	private SimpleStaffResponse createdBy;

	@Schema(
			name = "createdAt",
			example = "2024-04-16 05:20:42"
	)
	private Date createdAt;

	@Schema(
			name = "updatedAt",
			example = "2024-04-16 05:20:42"
	)
	private Date updatedAt;

	@Schema(name = "tags")
	private Set<TagResponse> tags;
}
