package com.realestate.property.mapper;

import com.realestate.property.dto.PropertyDTO;
import com.realestate.property.model.Property;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {ImageMapper.class})
public interface PropertyMapper {

    @Mapping(target = "images", ignore = true)
    Property toEntity(PropertyDTO propertyDTO);

    @Mapping(target = "images", source = "images")
    PropertyDTO toDTO(Property property);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "images", ignore = true)
    void updatePropertyFromDTO(PropertyDTO dto, @MappingTarget Property property);

    /**
     * Sets the base fields of a Property from a PropertyDTO.
     * This is used when creating a new Property.
     */
    @AfterMapping
    default void setBaseFields(@MappingTarget Property property) {
        if (property.getImages() != null) {
            property.getImages().forEach(image -> image.setProperty(property));
        }
    }
}