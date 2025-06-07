package com.shreyas.Hotel.Management.System.dao;

import com.shreyas.Hotel.Management.System.entity.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManagerDashboardDto {
    private User user;
    private HotelDao hotelDao;
    private List<RoomDao> roomDaoList;
    private List<Booking> bookingList;
    private List<Payment> paymentList;
}

