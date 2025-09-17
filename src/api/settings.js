const API_BASE_URL = "https://Veybeng-cora-test.hf.space/settings";


export const fetchSettings = async() =>{
    const response = await fetch(`${API_BASE_URL}/get-settings`)

    if(!response.ok) throw new Error("Failed to fetch settings")

    return await response.json();
}


export const uploadLogo = async (file) => {
  const formData = new FormData();
  formData.append("file", file); // ✅ MUST MATCH FastAPI param name

  const response = await fetch(`${API_BASE_URL}/upload-logo`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload logo");
  }

  return await response.json();
};

export const changeNameAPI = async (newName) => {
  const response = await fetch(`${API_BASE_URL}/change-name`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newName }),
  });

  if (!response.ok) {
    throw new Error("Failed to change name");
  }

  return await response.json();
};


export const changeColorAPI = async (primaryColor, secondaryColor) => {
  const response = await fetch(`${API_BASE_URL}/change-color`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      primary_color: primaryColor,
      secondary_color: secondaryColor,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to change colors");
  }

  return await response.json();
};

