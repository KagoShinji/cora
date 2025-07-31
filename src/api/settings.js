const API_BASE_URL = "http://127.0.0.1:8000/settings";


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