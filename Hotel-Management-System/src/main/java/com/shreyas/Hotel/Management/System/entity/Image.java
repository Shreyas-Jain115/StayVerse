package com.shreyas.Hotel.Management.System.entity;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long imgId;
    @ManyToOne(optional = true)
    @JoinColumn(name = "room_id")
    Room room;
    @ManyToOne(optional = true)
    @JoinColumn(name = "hotel_id")
    Hotel hotel;
    @Lob
    String img;
}
