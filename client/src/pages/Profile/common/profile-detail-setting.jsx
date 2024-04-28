import React, { useEffect, useState } from "react";

// Rtk
import {
  useUpdateBioMutation,
  useUpdateEmailMutation,
  useUpdateFullnameMutation,
} from "@/api/services/profile.service";

// Hooks
import { useToast } from "@/hooks/use-toast";

// Ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpinnerLoader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";

const ProfileDetailSetting = ({ authInfo }) => {
  const { email, fullName, bio } = authInfo;
  const [updateEmail, { isLoading: emailIsUpdating }] =
    useUpdateEmailMutation();

  const [updateFullname, { isLoading: fullNameIsUpdating }] =
    useUpdateFullnameMutation();

  const [updateBio, { isLoading: bioIsUpdating }] = useUpdateBioMutation();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    bio: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    setFormData((prev) => {
      return { ...prev, fullName, email, bio };
    });
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleUpdateEmail = async () => {
    try {
      const { message, status } = await updateEmail({
        email: formData.email,
      }).unwrap();
      if (status !== "success") {
        throw new Error();
      }

      toast({
        title: "Success",
        description: message,
      });
    } catch ({ data }) {
      toast({
        title: "Error",
        description: data.message,
      });
    }
  };

  const handleUpdateFullname = async () => {
    try {
      const { message, status } = await updateFullname({
        fullName: formData.fullName,
      }).unwrap();
      if (status !== "success") {
        throw new Error();
      }

      toast({
        title: "Success",
        description: message,
      });
    } catch ({ data: { message } }) {
      toast({
        title: "Error",
        description: message,
      });
    }
  };

  const handleUpdateBio = async () => {
    try {
      const { message, status } = await updateBio({
        bio: formData.bio,
      }).unwrap();

      toast({
        title: "Success",
        description: message,
      });
    } catch ({ data: { message } }) {
      toast({
        title: "Error",
        description: message,
      });
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Fullname</Label>
        <div className="flex gap-2 items center">
          <Input
            placeholder="@example.com"
            onChange={handleInputChange}
            value={formData?.fullName}
            type="text"
            name="fullName"
          />
          <Button
            className="bg-invert text-invert-foreground w-fit px-8"
            onClick={handleUpdateFullname}
          >
            {fullNameIsUpdating ? <SpinnerLoader /> : "Save"}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          this is your fullname you can change once in one month
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <div className="flex gap-2 items center">
          <Input
            placeholder="@example.com"
            value={formData?.email}
            onChange={handleInputChange}
            type="email"
            name="email"
          />
          <Button
            className="bg-invert text-invert-foreground w-fit px-8"
            onClick={handleUpdateEmail}
          >
            {emailIsUpdating ? <SpinnerLoader /> : "Save"}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">this is your email</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Bio</Label>
        <div className="flex gap-2 items center">
          <Textarea
            placeholder="Write something about you."
            onChange={handleInputChange}
            value={formData.bio}
            className="h-[150px]"
            name="bio"
          />
          <Button
            className="bg-invert text-invert-foreground w-fit px-8"
            onClick={handleUpdateBio}
          >
            {bioIsUpdating ? <SpinnerLoader /> : "Save"}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">Write Some about you</p>
      </div>
    </div>
  );
};

export default ProfileDetailSetting;
