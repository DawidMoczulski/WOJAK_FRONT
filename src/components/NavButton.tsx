import { useNavigate } from "react-router";

interface NavButtonProps {
  content: string;
  route: string;
  onClick?: () => void; // Dodany nowy prop onClick
}

function NavButton({ content, route, onClick }: NavButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
    if (onClick) {
      onClick(); // Wywołanie funkcji zamykającej menu
    }
  };

  return (
    <div className="ml-2 order-2 md:order-3 p-2">
      <button
        onClick={handleClick} // Używamy nowej funkcji handleClick
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white rounded-lg border border-[#7a9a6e] bg-[#7a9a6e] hover:bg-black transition-colors duration-200"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md">
          {content}
        </span>
      </button>
    </div>
  );
}

export default NavButton;
