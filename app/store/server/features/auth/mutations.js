import { useQueryClient, useMutation } from "@tanstack/react-query";
import { authKeys } from "./query-key-factory";
import http, { authHttp } from "@/app/libs/http";

const login = async (body) => {
  const jsonBody = JSON.stringify(body);
  const response = await authHttp.post("/auth/login", jsonBody, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useLogin = (successCallback) => {
  const mutation = useMutation(login, {
    mutationKey: authKeys.login(),
    onError: (error) => {},
    onSuccess: (data) => {
        successCallback(data.data);
        const token = data?.data?.token;
        const user = data?.data?.user;
        const expiryTime = new Date().getTime() + 1000 * 60 * 60 * 3;
        sessionStorage.setItem("token", JSON.stringify({ token, user, expiryTime }));
    },
  });
  
  return mutation;
}

const register = async (body) => {
  const jsonBody = JSON.stringify(body);
  const response = await authHttp.post("/auth/register", jsonBody, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useRegister = (successCallback) => {
  const mutation = useMutation(register, {
    mutationKey: authKeys.register(),
    onError: (error) => {},
    onSuccess: (data) => {
        successCallback(data.data);
    },
  });
  
  return mutation;
}

const sendEmail = async (body) => {
  const jsonBody = JSON.stringify(body);
  const response = await authHttp.post("/auth/reset_password", jsonBody, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useSendEmail = (successCallback) => {
  const mutation = useMutation(sendEmail, {
    mutationKey: authKeys.sendEmail(),
    onError: (error) => {},
    onSuccess: (data) => {
        successCallback(data.data);
    },
  });
  
  return mutation;
}

const confirmCode = async (body) => {
  const jsonBody = JSON.stringify(body);
  const response = await authHttp.post("/auth/check_confirmation_code", jsonBody, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useConfirmCode = (successCallback) => {
  const mutation = useMutation(confirmCode, {
    mutationKey: authKeys.confirmCode(),
    onError: (error) => {},
    onSuccess: (data) => {
        successCallback(data.data);
    },
  });
  
  return mutation;
}


const resetPassword = async (body) => {
  const jsonBody = JSON.stringify(body);
  const response = await authHttp.post("/auth/reset_password_using_email", jsonBody, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useResetPassword = (successCallback) => {
  const mutation = useMutation(resetPassword, {
    mutationKey: authKeys.resetPassword(),
    onError: (error) => {},
    onSuccess: (data) => {
        successCallback(data.data);
    },
  });
  
  return mutation;
}

const updatePassword = async (body) => {
  const jsonBody = JSON.stringify(body);
  const response = await http.post("/auth/update_password", jsonBody, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useUpdatePassword = (successCallback) => {
  const mutation = useMutation(updatePassword, {
    mutationKey: authKeys.updatePassword(),
    onError: (error) => {},
    onSuccess: (data) => {
        successCallback(data.data);
    },
  });
  
  return mutation;
}

const logout = async (body) => {
  const jsonBody = JSON.stringify(body);
  const response = await http.post("/auth/logout", jsonBody, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useLogout = (successCallback) => {
  const mutation = useMutation(logout, {
    mutationKey: authKeys.logout(),
    onError: (error) => {},
    onSuccess: (data) => {
        successCallback(data.data);
        sessionStorage.removeItem('token');
    },
  });
  
  return mutation;
}

const verifyEmail = async (body) => {
  const jsonBody = JSON.stringify(body);
  const response = await authHttp.post('/auth/verify_email', jsonBody, {
    headers: {
      "Content-Type" : "application/json"
    }
  });
  return response.data;
}

export const useVerifyEmail = (successCallback) => {
  const mutation = useMutation(verifyEmail, {
    mutationKey: authKeys.verifyEmail(),
    onError: (error) => {},
    onSuccess: (data) => {
      successCallback(data.data);
    }
  })

  return mutation;
}
