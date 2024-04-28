import React, { useRef, useState,  } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { div } from "@/components/ui/button";
import {
  useRemoveAvatarMutation,
  useUpdateAvatarMutation,
} from "@/api/services/profile.service";
import { useToast } from "@/hooks/use-toast";
import { SpinnerLoader } from "@/components/ui/loader";

const AvatarSetting = ({ fullName, avatar }) => {
  const [avatarFile, setAvatarFile] = useState("");
  const { toast } = useToast();

  const [updateAvatar, { isLoading: isUploading, error: uploadingError }] =
    useUpdateAvatarMutation();
  const [removeAvatar] = useRemoveAvatarMutation();

  const handleAvatarInputChange = async (e) => {
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("avatar", file);

    try {
      const res = await updateAvatar(fd).unwrap();

      if (res.status !== "success") {
        throw new Error();
      }
      toast({
        title: "Success",
        description: res.message,
      });
    } catch (err) {
      toast({
        title: "Denied",
        description: err.message,
      });
    }
  };

  const handleRemoveAvatar = async (e) => {
    try {
      const res = await removeAvatar().unwrap();

      if (res.status !== "success") {
        throw new Error();
      }
      toast({
        title: "Success",
        description: res.message,
      });
    } catch (err) {
      toast({
        title: "Error occured",
        description: err.message,
      });
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <div className="">
        <Dialog className="w-full" open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Avatar className="size-[100px]">
              <AvatarImage src={import.meta.env.VITE_PROFILE_URL + avatar.url} />
              <AvatarFallback className="capitalize text-xl">
                {isUploading ? <SpinnerLoader /> : fullName.trim().at(0)}
              </AvatarFallback>
            </Avatar>
          </DialogTrigger>
          <DialogContent className="h-[80vh] bg-transparent flex items-center">
            {!avatar.url ? (
              <div className="flex items-center justify-center w-full h-full">
                There is no uploaded profile picture
              </div>
            ) : (
              <img
                src={import.meta.env.VITE_PROFILE_URL + avatar.url}
                alt=""
                className="w-full h-auto max-h-full"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Change profile trigger */}

      <Popover>
        <PopoverTrigger>
          <div variant="ghost">Edit Profile Picture</div>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] flex flex-col 2 items-center">
          <span className="w-full cursor-pointer text-sm py-2 text-center hover:bg-muted rounded transition">
            <label
              htmlFor="avatar-input"
              className="w-full h-full cursor-pointer"
            >
              Upload new profile
            </label>
            <input
              type="file"
              className="hidden"
              id="avatar-input"
              onChange={handleAvatarInputChange}
              accept="image/jpeg,image/jpg,image/png"
              multiple={false}
            />
          </span>

          <div
            className="w-full text-red-700 py-2 cursor-pointer text-sm text-center"
            disabled={!avatar.url}
            onClick={handleRemoveAvatar}
          >
            Remove Profile Picture
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AvatarSetting;

// div