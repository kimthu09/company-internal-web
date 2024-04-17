package com.ciw.backend.service;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.Post;
import com.ciw.backend.entity.Tag;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.payload.ListResponse;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.page.AppPageRequest;
import com.ciw.backend.payload.page.AppPageResponse;
import com.ciw.backend.payload.post.*;
import com.ciw.backend.payload.tag.TagResponse;
import com.ciw.backend.payload.user.SimpleUserResponse;
import com.ciw.backend.repository.PostRepository;
import com.ciw.backend.repository.TagRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
	private final ObjectMapper objectMapper;
	private final PostRepository postRepository;
	private final TagRepository tagRepository;

	@Transactional
	public ListResponse<SimplePostResponse, PostFilter> getPosts(AppPageRequest page, PostFilter filter) {
		Pageable pageable = PageRequest.of(page.getPage() - 1,
										   page.getLimit(),
										   Sort.by(Sort.Direction.DESC, "updatedAt"));
		Specification<Post> spec = filterPosts(filter);

		Page<Post> postPage = postRepository.findAll(spec, pageable);

		List<Post> posts = postPage.getContent();

		List<SimplePostResponse> data = posts.stream().map(this::mapToSimpleDTO).toList();

		return ListResponse.<SimplePostResponse, PostFilter>builder()
						   .data(data)
						   .appPageResponse(AppPageResponse.builder()
														   .index(page.getPage())
														   .limit(page.getLimit())
														   .totalPages(postPage.getTotalPages())
														   .totalElements(postPage.getTotalElements())
														   .build())
						   .filter(filter)
						   .build();
	}

	private Specification<Post> filterPosts(PostFilter filter) {
		Specification<Post> spec = Specification.where(null);
		if (filter.getTitle() != null) {
			spec = PostSpecs.hasTitle(filter.getTitle());
		}
		if (filter.getTags() != null && !filter.getTags().isEmpty()) {
			spec = spec.and(PostSpecs.hasTag(filter.getTags()));
		}
		if (filter.getUpdatedAtFrom() != null) {
			spec = spec.and(PostSpecs.isUpdatedAfter(filter.getUpdatedAtFrom()));
		}
		if (filter.getUpdatedAtTo() != null) {
			spec = spec.and(PostSpecs.isUpdatedBefore(filter.getUpdatedAtTo()));
		}
		return spec;
	}

	@Transactional
	public PostResponse getPost(Long postId) {
		Post post = postRepository.findById(postId)
								  .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																	  Message.Post.POST_NOT_EXIST));

		return mapToDTO(post);
	}

	@Transactional
	public PostResponse createPost(CreatePostRequest request) {
		handleImagePreCreatePostRequest(request);

		Post post = mapToEntity(request);
		post.setTags(getTagsFromIds(request.getTags()));
		increaseNumberPost(post.getTags());

		return mapToDTO(postRepository.save(post));
	}

	@Transactional
	public SimpleResponse deletePost(Long postId) {
		Post post = postRepository.findById(postId)
								  .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																	  Message.Post.POST_NOT_EXIST));
		for (Tag tag : post.getTags()) {
			tag.getPosts().remove(post);
			tag.setNumberPost(tag.getNumberPost() - 1);
			tagRepository.save(tag);
		}

		postRepository.delete(post);
		return new SimpleResponse();
	}

	private void handleImagePreCreatePostRequest(CreatePostRequest request) {
		if (request.getImage().isEmpty()) {
			request.setImage(ApplicationConst.DEFAULT_POST_IMAGE);
		}
	}

	private Set<Tag> getTagsFromIds(Set<Long> tagIds) {
		Set<Tag> tags = new HashSet<>();
		for (Long tagId : tagIds) {
			Tag tag = tagRepository.findById(tagId)
								   .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																	   Message.Tag.TAG_NOT_EXIST));
			tags.add(tag);
		}
		return tags;
	}

	private void increaseNumberPost(Set<Tag> tags) {
		for (Tag tag : tags) {
			tag.setNumberPost(tag.getNumberPost() + 1);
			tagRepository.save(tag);
		}
	}

	private Post mapToEntity(CreatePostRequest request) {
		return Post.builder()
				   .title(request.getTitle())
				   .description(request.getDescription())
				   .content(request.getContent())
				   .image(request.getImage())
				   .attachments(request.getAttachments())
				   .build();
	}

	private PostResponse mapToDTO(Post post) {
		return PostResponse.builder()
						   .id(post.getId())
						   .title(post.getTitle())
						   .description(post.getDescription())
						   .content(post.getContent())
						   .image(post.getImage())
						   .attachments(post.getAttachments())
						   .createdBy(mapToSimpleUser(post.getCreatedBy()))
						   .createdAt(post.getCreatedAt())
						   .updatedAt(post.getUpdatedAt())
						   .tags(post.getTags().stream().map(this::mapTagToTagResponse).collect(Collectors.toSet()))
						   .build();
	}

	private SimplePostResponse mapToSimpleDTO(Post post) {
		return SimplePostResponse.builder()
								 .id(post.getId())
								 .title(post.getTitle())
								 .description(post.getDescription())
								 .image(post.getImage())
								 .createdBy(mapToSimpleUser(post.getCreatedBy()))
								 .updatedAt(post.getUpdatedAt())
								 .tags(post.getTags()
										   .stream()
										   .map(this::mapTagToTagResponse)
										   .collect(Collectors.toSet()))
								 .build();
	}

	private SimpleUserResponse mapToSimpleUser(User user) {
		return SimpleUserResponse.builder()
								 .id(user.getId())
								 .name(user.getName())
								 .email(user.getEmail())
								 .phone(user.getPhone())
								 .image(user.getImage())
								 .build();
	}

	private TagResponse mapTagToTagResponse(Tag tag) {
		return objectMapper.convertValue(tag, TagResponse.class);
	}
}
