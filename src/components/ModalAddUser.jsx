export default function ModalAddUser({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="!bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
        <h2 className="text-2xl font-bold mb-4 !text-black text-center">Add New User</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
            onClose();
          }}
          className="flex flex-col gap-4 !text-black"
        >
          <input
            type="text"
            placeholder="Username"
            className="!border !border-red-800 !rounded-md !px-4 !py-2 !text-black !outline-none focus:!ring-1 focus:!ring-red-700"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="!border !border-red-800 !rounded-md !px-4 !py-2 !text-black !outline-none focus:!ring-1 focus:!ring-red-700"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="!border !border-red-800 !rounded-md !px-4 !py-2 !text-black !outline-none focus:!ring-1 focus:!ring-red-700"
            required
          />
          <select
            className="!border !border-red-800 !rounded-md !px-4 !py-2 !text-black !outline-none focus:!ring-1 focus:!ring-red-700"
            required
          >
            <option value="">Select Role</option>
            <option value="creator">Creator</option>
            <option value="approver">Approver</option>
            <option value="co-super-admin">Co Super Admin</option>
          </select>

          <select
            className="!border !border-red-800 !rounded-md !px-4 !py-2 !text-black !outline-none focus:!ring-1 focus:!ring-red-700"
            required
          >
            <option value="">Select Department</option>
            <option value="cs">Information Technology</option>
            <option value="ba">Business Administration</option>
            <option value="ed">Education</option>
            <option value="eng">Engineering</option>
            {/* Add more departments here as needed */}
          </select>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="!px-4 !py-2 !text-red-800 !border !border-red-800 !rounded-md hover:!bg-red-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="!px-4 !py-2 !bg-red-800 !text-white !rounded-md hover:!bg-red-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
