package com.shreyas.Hotel.Management.System.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Document {
    @Id
    Long userId;
    @Lob
    @Column(columnDefinition = "TEXT") // Ensures the database column can handle large text
    private String img; // This field stores the file URL

    public Long getUserId() {
        return userId;
    }

    public String getImg() {
        return img;
    }
}
