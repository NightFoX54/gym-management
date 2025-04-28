package com.gymmanagement.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserProgressResponseDTO {
    private UserProgressGoalDTO goal;
    private List<UserStatisticsDTO> statisticsHistory;
}
