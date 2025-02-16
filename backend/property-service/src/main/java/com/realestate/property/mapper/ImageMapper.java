package com.realestate.property.mapper;

import com.realestate.property.dto.ImageDTO;
import com.realestate.property.model.Image;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {PropertyMapper.class})
public interface ImageMapper {

    @Mapping(source = "property.id", target = "propertyId")
    ImageDTO toDTO(Image image);

    @Mapping(target = "property", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Image toEntity(ImageDTO imageDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "property", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateImageFromDTO(ImageDTO dto, @MappingTarget Image image);
}