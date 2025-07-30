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
//department
export const createDepartment = async (departmentData) =>{
    try{
        console.log("🔍 Sending userData:", departmentData);
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
                'Content-type':'json/application'
            },
        })
        if(response.ok){
            console.log(`Department with an ID of ${department_id} is successfully deleted`)
        }else{
            const error = json.response()
            throw error
        }

    } catch (error) {
        console.error("Network error during department deletion:", error);
        return false;
    }
}


//upload documents
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