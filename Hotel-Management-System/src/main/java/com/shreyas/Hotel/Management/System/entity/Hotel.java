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
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hotelId;
    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;
    private String name;
    private String location;
    private String description;
    private String contactNumber;

    public Hotel(User manager, String name, String location, String description, String contactNumber) {
        this.manager = manager;
        this.name = name;
        this.location = location;
        this.description = description;
        this.contactNumber = contactNumber;
    }
}
