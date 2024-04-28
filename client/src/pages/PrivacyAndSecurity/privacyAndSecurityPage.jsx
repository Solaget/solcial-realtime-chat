import { useState } from "react";
// Components 👇🏼
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SpinnerLoader } from "@/components/ui/loader";
// Hooks 👇🏼
import { useToast } from "@/hooks/use-toast";
// Api 👇🏼
import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from "@/api/services/account.service";

const PrivacyAndSecurityPage = () => {
  const [changePassword, { isLoading: isChanging }] =
    useChangePasswordMutation();
  const [deleteAccount, { isLoading: isAccDeleting, error }] =
    useDeleteAccountMutation();
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const { toast } = useToast();

  const handleChangePass = async () => {
    try {
      const res = await changePassword({ oldPassword, newPassword }).unwrap();
      if (res.status !== "success") {
        throw new Error();
      }
      setOldPassword("");
      setNewPassword("");
      toast({
        title: "Success",
        description: res.message,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.data.message,
      });
    }
  };

  const [delAcc_confirmPassword, setDelAcc_confirmPassword] = useState("");
  const handleDeleteAccount = async () => {
    try {
      const data = await deleteAccount({
        confrimPassword: delAcc_confirmPassword,
      }).unwrap();
      toast({
        title: "Success",
        description: data.message,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.data.message,
      });
    }
  };

  return (
    <div className="w-full h-screen bg-yellow overflow-y-scroll px-2">
      <div className="flex flex-col gap-8">
        <header>
          <h2 className="text-lg">Privacy and Security</h2>
          <p className="text-sm text-muted-foreground">
            This is how user can see your profile
          </p>
        </header>

        <main className="flex flex-col gap-6 w-full sm:w-[70%] md:w-[50%] ">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <Label>Old password</Label>
              <Input
                placeholder="*****"
                className="mt-2"
                type="password"
                onChange={(e) => setOldPassword(e.target.value.trim())}
                value={oldPassword}
              />
              <p className="text-muted-foreground text-sm">
                Please write your old password
              </p>
            </div>

            <div className="flex flex-col">
              <Label>New password</Label>
              <Input
                placeholder="******"
                className="mt-2"
                type="password"
                onChange={(e) => setNewPassword(e.target.value.trim())}
                value={newPassword}
              />
              <p className="text-muted-foreground text-sm">
                Write your new password please dont't share your password this
                may attack you
              </p>
            </div>

            <Button
              className="bg-invert text-invert-foreground w-fit px-8 mt-4"
              onClick={handleChangePass}
            >
              {isChanging ? <SpinnerLoader /> : "Update Password"}
            </Button>

            <div className="flex flex-col mt-4">
              <p className="text-muted-foreground text-sm">Delete my account</p>
              <Drawer>
                <DrawerTrigger>
                  <h3 className="text-sm text-red-500 w-fit">Delete Account</h3>
                </DrawerTrigger>

                <DrawerContent className="md:w-[50%] md:mx-auto">
                  <DrawerHeader>
                    <DrawerTitle>
                      Are you absolutely sure to delete your account?
                    </DrawerTitle>
                    <DrawerDescription>
                      This action cannot be undone. Your all chats and Your
                      all messages will be removed from server permanently!
                    </DrawerDescription>
                    <div className="flex flex-col flex-start text-left mt-2">
                      <Label>Confrim your password</Label>
                      <Input
                        placeholder="*****"
                        className="mt-2"
                        type="password"
                        value={delAcc_confirmPassword}
                        onChange={(e) =>
                          setDelAcc_confirmPassword(e.target.value.trim())
                        }
                      />
                    </div>
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button
                      disabled={isAccDeleting}
                      onClick={handleDeleteAccount}
                    >
                      {isAccDeleting ? "Loading..." : "Delete Account"}
                    </Button>
                    <DrawerClose>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyAndSecurityPage;
