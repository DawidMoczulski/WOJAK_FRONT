type Props = {
  pinName: string;
  setPinName: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function PinInputForm({
  pinName,
  setPinName,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg z-50">
      <h2 className="text-lg font-semibold mb-2">Podaj nazwę pinezki</h2>
      <input
        type="text"
        className="border p-2 rounded w-full mb-2"
        value={pinName}
        onChange={(e) => setPinName(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          onClick={onCancel}
        >
          Anuluj
        </button>
        <button
          className="bg-[#7a9a6e] text-white px-4 py-2 rounded hover:bg-[#678a5f]"
          onClick={onConfirm}
        >
          Stwórz
        </button>
      </div>
    </div>
  );
}
