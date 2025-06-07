package com.shreyas.Hotel.Management.System.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
    @ManyToMany(mappedBy = "roomList")
    @JsonIgnore
    private List<Booking> bookings;
    private String roomType;
    private Double pricePerNight;
    @Enumerated(EnumType.STRING)
    private AvailabilityStatus availabilityStatus;
    private int capacity;
    public enum AvailabilityStatus {
        AVAILABLE, BOOKED, MAINTENANCE,NONAVAILABLE
    }
    public Room(Hotel hotel, String roomType, Double pricePerNight, int capacity) {
        this.hotel=hotel;
        this.roomType=roomType;
        this.pricePerNight=pricePerNight;
        this.capacity=capacity;
        availabilityStatus=AvailabilityStatus.AVAILABLE;
    }

    @Override
    public String toString() {
        return "Room{" +
                "roomId=" + roomId +
                ", hotel=" + hotel +
                ", bookings=" + bookings +
                ", roomType='" + roomType + '\'' +
                ", pricePerNight=" + pricePerNight +
                ", availabilityStatus=" + availabilityStatus +
                ", capacity=" + capacity +
                '}';
    }
}
