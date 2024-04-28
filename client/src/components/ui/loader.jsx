import { Loader as LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";
export function SpinnerLoader({ className, fontSize = 20 }) {
  return (
    <div className="animate-spin">
      <LoaderIcon className={className} fontSize={fontSize} />
    </div>
  );
}
