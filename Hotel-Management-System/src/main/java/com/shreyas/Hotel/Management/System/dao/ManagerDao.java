package com.shreyas.Hotel.Management.System.dao;

import com.shreyas.Hotel.Management.System.entity.*;
import lombok.*;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Component
@ToString
public class ManagerDao {
    User user;
    HotelDao hotelDao;
    List<RoomDao> roomDaoList;
    List<Booking> bookingList;
    List<Payment> paymentList;
}

