package com.finnettrust.server.post;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")

public interface PostMapper {
    PostDto toDto(Post post);
}