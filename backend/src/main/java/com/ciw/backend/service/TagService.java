package com.ciw.backend.service;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.Post;
import com.ciw.backend.entity.Tag;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.payload.SimpleListResponse;
import com.ciw.backend.payload.tag.NameTagRequest;
import com.ciw.backend.payload.tag.TagResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.repository.PostRepository;
import com.ciw.backend.repository.TagRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TagService {
	private final TagRepository tagRepository;
	private final PostRepository postRepository;
	private final ObjectMapper objectMapper;

	public SimpleListResponse<TagResponse> fetchAllTag() {
		return new SimpleListResponse<>(tagRepository.findAll().stream().map(this::mapToDTO).toList());
	}

	public TagResponse createTag(NameTagRequest tagRequest) {
		Tag tag = mapToEntity(tagRequest);
		tagRepository.save(tag);
		return mapToDTO(tag);
	}

	public TagResponse updateTag(Long tagId, NameTagRequest tagRequest) {
		Tag tag = tagRepository.findById(tagId)
							   .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																   Message.Tag.TAG_NOT_EXIST));

		tag.setName(tagRequest.getName());
		tagRepository.save(tag);

		return mapToDTO(tag);
	}

	public SimpleResponse deleteTag(Long tagId) {
		Tag tag = tagRepository.findById(tagId)
							   .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																   Message.Tag.TAG_NOT_EXIST));
		for (Post post : tag.getPosts()) {
			post.getTags().remove(tag);
			postRepository.save(post);
		}

		tagRepository.delete(tag);
		return new SimpleResponse();
	}


	private Tag mapToEntity(NameTagRequest tagRequest) {
		return objectMapper.convertValue(tagRequest, Tag.class);
	}

	private TagResponse mapToDTO(Tag tag) {
		return objectMapper.convertValue(tag, TagResponse.class);
	}
}
