const API_BASE_URL = "http://127.0.0.1:8000/users";

export const createUsers = async (userData) => {
    try {
        console.log("🔍 Sending userData:", userData);
        const response = await fetch(`${API_BASE_URL}/sign-up`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create user');
        }

        const data = await response.json(); 
        return data; 
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(userData)
        })
        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Something unexpected happen please try again')
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Failed to login:",error);
        throw error
    }
}

export const uploadDocument = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to upload document");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};