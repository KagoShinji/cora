import { useState } from "react";
import { useAuthStore } from "../stores/userStores";

export default function ModalAddDepartment({ isOpen, onClose, onSave }) {
  const [newDepartment, setNewDepartment] = useState("");

  const addDepartment = useAuthStore((state)=>state.addDepartment)
  const getDepartment = useAuthStore((state) => state.getDepartment); 


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDepartment({department_name: newDepartment})
      await getDepartment();
      alert("Department created succesfully")
      onSave(newDepartment); 
      setNewDepartment('')
      onClose()
    } catch (err) {
      console.error("Failed to create department")
      throw err
    }
    
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">
          Add Department
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-primary">
          <div>
            <label className="block mb-1 font-medium">
              Department Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="Enter department name"
              required
              className="w-full border border-primary rounded-md px-4 py-2 text-primary outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setNewDepartment("");
                onClose();
              }}
              className="!px-4 !py-2 !bg-white !text-primary !border !border-primary !rounded-md hover:!bg-primary/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 !bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
