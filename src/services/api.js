import axios from "axios";

//local
const api = axios.create({
  baseURL: "http://127.0.0.1:8080/",
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});


// Modify the request interceptor
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;

    // Don't set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generic API service methods
export const apiService = {
  get: async (url) => {
    try {
      const response = await api.get(url);
      console.log("API service methods get:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (url, data) => {
    try {
      const response = await api.post(url, data);
      console.log("API service methods post:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Authentication functions using authApi (without interceptors)
export const sendOtp = async (phoneNumber) => {
  try {
    const response = await api.post("device/sginin", {
      phone: phoneNumber,
    });
    console.log("API Response sendOtp:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOtp = async (phoneNumber, otpCode) => {
  try {
    const response = await api.post("device/checksms", {
      phone: phoneNumber,
      sms: otpCode,
    });

    console.log("API Response verifyOtp:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

// Protected endpoints using main api instance
export const signOut = async () => {
  try {
    await api.post("device/signout");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const fetchDataDevice = async (encode) => {
  return apiService.post(`device/${encode}`);
};

export const createTicket = async (ticketData) => {
  try {
    // Check if we have any images to handle
    const hasImages = ticketData.images && ticketData.images.length > 0;

    // If we have images, use FormData to send both files and data
    if (hasImages) {
      const formData = new FormData();

      // Append all ticket data fields
      formData.append("SERNUM", ticketData.serialNumber);
      formData.append("CUSTNAME", ticketData.customerNumber);
      formData.append("CALLTYPECODE", ticketData.callType);
      formData.append("ELDN_UPDSOURCE", ticketData.updateSource);
      formData.append("ELDN_UPDSRCPHONEMAIL", ticketData.contactInfo);
      formData.append("TEXT", ticketData.description);
      formData.append("TITLE", ticketData.title);
      formData.append("URGENCY", ticketData.urgency);
      formData.append("EMAIL", ticketData.email || "");

      // Append images
      ticketData.images.forEach((image, index) => {
        if (index < 5) {
          // Limit to 5 images total
          formData.append("images", image);
        }
      });

      // Important: Remove Content-Type from headers
      const response = await api.post("device/createticket", formData, {
        headers: {
          Accept: "application/json",
        },
      });

      return response.data;
    }

    // If no images, send regular JSON data
    const response = await api.post("device/createticket", {
      SERNUM: ticketData.serialNumber,
      CUSTNAME: ticketData.customerNumber,
      CALLTYPECODE: ticketData.callType,
      ELDN_UPDSOURCE: ticketData.updateSource,
      ELDN_UPDSRCPHONEMAIL: ticketData.contactInfo,
      TEXT: ticketData.description,
      TITLE: ticketData.title,
      URGENCY: ticketData.urgency,
      EMAIL: ticketData.email || "",
      IMAGES: [], // Empty array when no images
    });

    console.log("API Response createTicket:", response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 413) {
      throw new Error("File size too large. Please reduce the image size.");
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    console.error("Error creating ticket:", error);
    throw error;
  }
};
