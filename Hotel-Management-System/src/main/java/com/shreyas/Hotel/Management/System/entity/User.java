package com.shreyas.Hotel.Management.System.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;
    private String email;
    private String password;
    private String phone;

    @Enumerated(EnumType.STRING)
    private TierLevel tierLevel;

    @Enumerated(EnumType.STRING)
    private Role role;

    public User(String name, String email, String password, String phone) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        tierLevel=TierLevel.BRONZE;
    }

    public enum TierLevel {
        BRONZE, SILVER, GOLD
    }

    public enum Role {
        GUEST, MANAGER, ADMIN
    }
}

