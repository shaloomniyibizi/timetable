import { Button } from "@/components/ui/button";
import { BeatLoader } from "react-spinners";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full rounded"}
    >
      {isLoading ? <BeatLoader /> : children}
    </Button>
  );
};

export default SubmitButton;
