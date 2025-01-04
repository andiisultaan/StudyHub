import { Loader2 } from "lucide-react";
import { delay } from "./delay";

export default async function Loading() {
  await delay(500);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
      </div>
    </div>
  );
}
