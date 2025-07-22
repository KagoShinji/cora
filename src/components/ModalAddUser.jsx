import { useState } from "react";

export default function ModalAddUser({ isOpen, onClose, onSave,isLoading,error}) {
  if (!isOpen) return null;

  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [school,setSchool] = useState("")
  const [role,setRole] = useState('')


  const handleSubmit = async(e) => {
    e.preventDefault()

    const userData = {
      name:username,
      email,
      password,
      role,
      school,
    }
    try{
      await onSave(userData);
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('Co-Super Admin');
      setSchool('')
      onClose();
    }catch(err){
      console.error("Form submission failed in ModalAddUser:", err);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="!bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
        <h2 className="text-2xl font-bold mb-4 !text-primary text-center">
          Add New Co-Super Admin
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 !text-primary"
        >
          <div>
            <label className="block mb-1 font-medium">
              Username <span className="text-red-600">*</span>
            </label>
            <input
              onChange={(e)=>setUsername(e.target.value)}
              type="text"
              placeholder="Enter username"
              value={username}
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              onChange={(e)=>setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              onChange={(e)=>setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Role <span className="text-red-600">*</span>
            </label>
            <select
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
              onChange={(e)=>setRole(e.target.value)}
              
            >
              <option value="">Select Role</option>
              <option value="co-superadmin">Co-Super Admin</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              School <span className="text-red-600">*</span>
            </label>
            <input
              onChange={(e)=>setSchool(e.target.value)}
              type="text"
              placeholder="Enter school"
              className="w-full !border !border-primary !rounded-md !px-4 !py-2 !text-primary !outline-none focus:!ring-1 focus:!ring-primary"
              required
            />
            {error && (
            <p className="text-red-600 bg-red-100 border border-red-400 rounded p-2 text-sm text-center">
              {error}
            </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="!px-4 !py-2 !bg-white !text-primary !border !border-primary !rounded-md hover:!bg-primary/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="!px-4 !py-2 !bg-primary !text-white !rounded-md hover:!bg-primary/90 transition"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
