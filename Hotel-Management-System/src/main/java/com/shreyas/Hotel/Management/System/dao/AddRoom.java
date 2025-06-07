package com.shreyas.Hotel.Management.System.dao;

import lombok.Data;

@Data
public class AddRoom {
    public String roomType;
    public Double pricePerNight;
    public int capacity;
}
