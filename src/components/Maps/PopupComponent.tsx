import { MdDeleteOutline } from "react-icons/md";
import Pin from "../../Types/Pin";

interface PopupComponentProps {
  pin: Pin;
  conversationId: string;
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
}

function PopupComponent({ pin, conversationId, setPins }: PopupComponentProps) {
  async function pinDelete(pinId: number) {
    try {
      await fetch(
        `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations/${conversationId}/pins/${pinId}`,
        {
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          method: "DELETE",
        }
      );
      setPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="p-2 max-w-[200px] flex items-center justify-between space-x-2">
      <p className="text-sm font-medium text-gray-800">{pin.description}</p>

      {pin.id && (
        <MdDeleteOutline
          className="text-red-500 w-5 h-5 cursor-pointer hover:text-red-600 transition duration-200"
          onClick={() => pinDelete(pin.id!)}
        />
      )}
    </div>
  );
}

export default PopupComponent;
