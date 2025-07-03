interface SnackbarProps {
  message: string;
  onClose: () => void;
}

function Snackbar({ message, onClose }: SnackbarProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center justify-between gap-4 bg-red-500 text-white px-4 py-3 rounded shadow-lg animate-slide-in">
      <span>{message}</span>
      <button onClick={onClose} className="font-bold hover:text-gray-200">
        &times;
      </button>
    </div>
  );
}

export default Snackbar;
