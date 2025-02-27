package com.realestate.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertySearchResponse {
    private List<PropertyDTO> content = new ArrayList<>();
    private PageableObject pageable;
    private boolean last;
    private int totalPages;
    private long totalElements;
    private int size;
    private int number;
    private SortObject sort;
    private boolean first;
    private int numberOfElements;
    private boolean empty;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageableObject {
        private long offset;
        private SortObject sort;
        private int pageNumber;
        private int pageSize;
        private boolean paged;
        private boolean unpaged;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SortObject {
        private boolean empty;
        private boolean sorted;
        private boolean unsorted;
    }
}