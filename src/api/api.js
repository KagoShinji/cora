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

export const getUser = async () => {
    const response = await fetch(`${API_BASE_URL}/users`)
    if(!response.ok){
        throw new Error("Failed to fetch users");
    }
    return await response.json();
    
}

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

export const userUpdate = async (users_id, updatedData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-users/${users_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update user');
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return {}; 
    }

  } catch (error) {
    console.error("Update error:", error.message);
    throw error;
  }
};

export const userDelete = async(users_id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/delete-users/${users_id}`,{
            method:"DELETE",
            headers:{
                'Content-Type':'application/json'
            },
        })
    } catch (error) {
        console.error("Network error during department deletion:", error);
        return false;
    }
}
//department
export const createDepartment = async (departmentData) =>{
    try{
        const response = await fetch(`${API_BASE_URL}/add-department`,{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(departmentData)
        })
        if(!response.ok){
            const errorData = await  response.json();
            throw new Error(errorData.detail || 'Something wrong creating department')
        }
        const data = await response.json()
        return data
        
    }
    catch(error){
        console.error("Failed to create:",error)
        throw error
    }
}

export const fetchDepartment = async () => {
    const response = await fetch(`${API_BASE_URL}/department`)
    if(!response.ok){
        throw new Error("Failed to fetch departments");
    }
    return await response.json();
}

export const deleteDepartment = async (department_id) => {
    try {
        if(!department_id){
            console.error("Department ID is required to delete department")
            throw Error
        }
        const response = await fetch(`${API_BASE_URL}/delete-department/${department_id}`,{
            method:"DELETE",
            headers:{
                'Content-Type':'application/json'
            },
        })
        if(response.ok){
            console.log(`Department with an ID of ${department_id} is successfully deleted`)
        }else{
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to delete department");
        }

    } catch (error) {
        console.error("Network error during department deletion:", error);
        return false;
    }
}
export const updateDepartment = async (department_id, department_name) => {
    try {
        if (!department_id || !department_name) {
            throw new Error("Both department ID and name are required");
        }

        const response = await fetch(`${API_BASE_URL}/update-department/${department_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                department_name: department_name
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to update department");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Update failed:", error.message);
        throw error;
    }
};


//upload documents
export const uploadDocument = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers:{
        Authorization: `Bearer ${token}`
      },
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

export const submitManualEntry = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/manual-entry`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData, 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to submit manual document");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Manual entry failed:", error);
    throw error;
  }
};

export const fetchDocument = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

export const viewDocument = async (docId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${docId}/view`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch document");
    }

    const contentType = response.headers.get("Content-Type");

    // Handle plain text files explicitly
    if (contentType && contentType.includes("text/plain")) {
      const text = await response.text();
      const blob = new Blob([text], { type: "text/plain" });
      return blob;
    }

    return await response.blob();
  } catch (error) {
    console.error("Error viewing document:", error);
    throw error;
  }
};

export const approveDocument = async (doc_id, status) => {
  try {
    const token = localStorage.getItem("access_token"); 

    const response = await fetch(`${API_BASE_URL}/approve_document/${doc_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Approval failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error approving document:", error.message);
    throw error;
  }
};

export const declineDocument = async (doc_id, status, remarks) => {
  try {
    const token = localStorage.getItem("access_token");

    const payload = {
      status,
      remarks: (remarks || "").trim(),
    };

    console.log("Sending payload:", payload);

    const response = await fetch(`${API_BASE_URL}/decline_document/${doc_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to decline document");
    }

    return await response.json();
  } catch (error) {
    console.error("Decline document failed:", error);
    throw error;
  }
};

export const generateAnswer = async (query, accessToken, onToken) => {
  const res = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to generate answer");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    if (onToken) onToken(chunk);  // stream chunks to UI
  }
};