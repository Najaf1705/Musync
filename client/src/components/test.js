import { useToast } from '@heroui/toast';

const Test = () => {
  const { toast } = useToast();

  const handleClick = () => {
    toast.success("Welcome back!", {
      description: "You have successfully logged in.",
      duration: 3000, // optional
    });
  };

  return (
    <button onClick={handleClick} className="px-4 py-2 bg-blue-600 text-white rounded">
      Show Toast
    </button>
  );
};

export default Test;
