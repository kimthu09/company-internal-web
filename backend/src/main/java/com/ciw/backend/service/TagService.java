package com.ciw.backend.service;

import com.ciw.backend.entity.Post;
import com.ciw.backend.entity.Tag;
import com.ciw.backend.payload.SimpleListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.tag.CreateTagRequest;
import com.ciw.backend.payload.tag.TagResponse;
import com.ciw.backend.payload.tag.UpdateTagRequest;
import com.ciw.backend.repository.PostRepository;
import com.ciw.backend.repository.TagRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TagService {
	private final TagRepository tagRepository;
	private final PostRepository postRepository;
	private final ObjectMapper objectMapper;

	@Transactional
	public SimpleListResponse<TagResponse> fetchAllTag() {
		return new SimpleListResponse<>(tagRepository.findAll().stream().map(this::mapToDTO).toList());
	}

	@Transactional
	public TagResponse createTag(CreateTagRequest tagRequest) {
		Tag tag = mapToEntity(tagRequest);
		tagRepository.save(tag);
		return mapToDTO(tag);
	}

	@Transactional
	public TagResponse updateTag(Long tagId, UpdateTagRequest tagRequest) {
		Tag tag = Common.findTagById(tagId, tagRepository);

		Common.updateIfNotNull(tagRequest.getName(), tag::setName);
		tagRepository.save(tag);

		return mapToDTO(tag);
	}

	@Transactional
	public SimpleResponse deleteTag(Long tagId) {
		Tag tag = Common.findTagById(tagId, tagRepository);
		for (Post post : tag.getPosts()) {
			post.getTags().remove(tag);
			postRepository.save(post);
		}

		tagRepository.delete(tag);
		return new SimpleResponse();
	}


	private Tag mapToEntity(CreateTagRequest tagRequest) {
		return objectMapper.convertValue(tagRequest, Tag.class);
	}

	private TagResponse mapToDTO(Tag tag) {
		return objectMapper.convertValue(tag, TagResponse.class);
	}
}
