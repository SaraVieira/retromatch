import { Button } from "@nextui-org/react";
import { IconX } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

type ScrappingInfo = {
  total: number;
  current: number;
};

const loadingToast = (t: any, data: ScrappingInfo) => (
  <span className="flex items-center gap-2">
    Scrapping: {data.current} of {data.total}
    <Button
      isIconOnly
      size="sm"
      variant="light"
      onClick={() => toast.dismiss(t.id)}
    >
      <IconX className="w-4 h-4" />
    </Button>
  </span>
);

export const Toasts = () => {
  const loading = useRef<any>();

  useEffect(() => {
    window.ipc.once("scrapping", (data: ScrappingInfo) => {
      loading.current = toast.loading((t) => loadingToast(t, data));
    });
    window.ipc.subscribe("scrapping", (data: ScrappingInfo) => {
      toast.loading((t) => loadingToast(t, data), {
        id: loading.current
      });

      if (data.current === data.total) {
        toast.success(`Done!`, {
          id: loading.current
        });
      }
    });
  }, []);

  return <div />;
};
