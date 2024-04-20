import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { FaPen } from "react-icons/fa";

export type ImageProps = {
  currentImage: string;
  handleImageSelected: () => void;
  image: any;
  setImage: (value: any) => void;
};

const ChangeImage = ({
  image,
  setImage,
  currentImage,
  handleImageSelected,
}: ImageProps) => {
  const [imagePreviews, setImagePreviews] = useState<any>();
  const handleMultipleImage = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (file && file.type.includes("image")) {
        setImage(file);
        console.log(file.type);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreviews(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImage(null);
        toast({
          variant: "destructive",
          title: "Có lỗi",
          description: "File không hợp lệ",
        });
        console.log("file không hợp lệ");
      }
    } else {
      setImage(null);
    }
  };
  const [open, setOpen] = useState(false);
  const handleOpen = (value: boolean) => {
    if (value) {
      setImage(null);
      setImagePreviews(null);
    }
    setOpen(value);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className=" absolute bottom-0 left-1 bg-white px-2"
        >
          <FaPen className="mr-1" /> Sửa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[472px] p-0 bg-white">
        <DialogHeader>
          <DialogTitle className="p-6 pb-0">Chọn hình ảnh</DialogTitle>
        </DialogHeader>
        <form>
          <div className="p-6 flex flex-col items-center gap-4 border-y-[1px]">
            <div className="relative rounded-full border overflow-clip">
              {image ? (
                <img
                  src={imagePreviews}
                  alt={`Preview`}
                  className="h-[100px] w-[100px] object-cover"
                />
              ) : (
                <img
                  alt="Avatar"
                  src={currentImage}
                  className="h-[100px] w-[100px] object-cover"
                />
              )}
            </div>

            <Input
              className="w-56"
              id="img"
              type="file"
              onChange={handleMultipleImage}
            ></Input>
          </div>
          <div className="p-4 flex-1 flex justify-end">
            <div className="flex gap-4">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setOpen(false)}
              >
                Huỷ
              </Button>

              <Button
                type="button"
                onClick={() => {
                  handleImageSelected();
                  setOpen(false);
                }}
              >
                Thay đổi
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeImage;
