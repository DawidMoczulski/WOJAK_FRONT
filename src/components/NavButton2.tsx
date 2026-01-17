import { useNavigate } from "react-router";

interface NavButtonProps {
  content: string;
  route: string;
}

function NavButton({ content, route }: NavButtonProps) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(route)}
      className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-white rounded-lg border border-[#7a9a6e] bg-[#7a9a6e] hover:bg-black transition-colors duration-200"
    >
      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-600 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
        {content}
      </span>
    </button>
  );
}

export default NavButton;
