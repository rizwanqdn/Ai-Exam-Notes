import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/slice/userSlice";
export const getUser = async (dispatch) => {
  try {
    const result = await axios.get(serverUrl + "/api/user/currentuser", {
      withCredentials: true,
    });
    console.log(result.data);
    dispatch(setUserData(result.data));
  } catch (error) {
    console.log(error);
  }
};

export const submitPromtAi = async (payload) => {
  try {
    const response = await axios.post(
      serverUrl + "/api/gemini/generate",
      payload,
      { withCredentials: true },
    );

    console.log(response.data, "response Data");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
