type Props = {
  onSelect: (type: "wróg" | "sojusznik" | "obiekt") => void;
};

export default function PinTypeSelector({ onSelect }: Props) {
  return (
    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg z-50">
      <h2 className="text-lg font-semibold mb-3">Wybierz typ pinezki</h2>
      <div className="flex gap-4">
        <button
          className="flex items-center space-x-2 px-4 py-2 border rounded text-red-600 hover:bg-red-50"
          onClick={() => onSelect("wróg")}
        >
          <span className="w-3 h-3 rounded-full bg-red-600" />
          <span>Wróg</span>
        </button>
        <button
          className="flex items-center space-x-2 px-4 py-2 border rounded text-green-600 hover:bg-green-50"
          onClick={() => onSelect("sojusznik")}
        >
          <span className="w-3 h-3 rounded-full bg-green-600" />
          <span>Sojusznik</span>
        </button>
        <button
          className="flex items-center space-x-2 px-4 py-2 border rounded text-blue-600 hover:bg-blue-50"
          onClick={() => onSelect("obiekt")}
        >
          <span className="w-3 h-3 rounded-full bg-blue-600" />
          <span>Obiekt</span>
        </button>
      </div>
    </div>
  );
}
