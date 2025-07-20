export default function ModalAddDepartment({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="!bg-white rounded-xl w-full max-w-md p-6 shadow-2xl border">
        <h2 className="text-2xl font-bold mb-4 !text-black text-center">Add Department</h2>

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
            placeholder="Department Name"
            className="!border !border-red-800 !rounded-md !px-4 !py-2 !text-black !outline-none focus:!ring-1 focus:!ring-red-700"
            required
          />

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
