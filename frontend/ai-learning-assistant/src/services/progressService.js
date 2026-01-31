import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPath";

const getProgress = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch progress data" };
    }
};

const progressService = {
    getProgress,
};
export default progressService;