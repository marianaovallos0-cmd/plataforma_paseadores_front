import { WalkersRanking } from "@/core/types/analytics.types";
import { httpClient } from "../http/httpClient";
import { handleApiResponse } from "./api.handler";

class AnalyticsService {
  private static instance: AnalyticsService;
  private constructor() {}

  static getInstance() {
    if (!AnalyticsService.instance) AnalyticsService.instance = new AnalyticsService();
    return AnalyticsService.instance;
  }

  async getWalkersRanking() {
    const response = await httpClient.get('/rankings/walkers');
    return handleApiResponse<WalkersRanking[]>(response);
  }

  async refreshWalkersRanking() {
    const response = await httpClient.post('/rankings/walkers/refresh');
    return response;
  }
}

export default AnalyticsService.getInstance();