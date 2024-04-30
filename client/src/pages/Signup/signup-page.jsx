import { useState } from "react";
// Lib 👇🏼
import { useNavigate } from "react-router-dom";
// Api 👇🏼
import { useSignupMutation } from "../../api/services/auth.service";
import { useLazyFetchCurrentAccountQuery } from "../../api/services/account.service";
// Components 👇🏼
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpinnerLoader } from "@/components/ui/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Hooks 👇🏼
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [signupUser, { data, isLoading, error }] = useSignupMutation();
  const [fetchAccount] = useLazyFetchCurrentAccountQuery();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  let _formErrors = { fullName: "", email: "", password: "" };
  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  function resetFormErrors() {
    setFormErrors({
      email: "",
      password: "",
      fullName: "",
    });
    _formErrors = { fullName: "", email: "", password: "" };
  }

  const handleSubmit = async () => {
    try {
      const res = await signupUser(formData).unwrap();
      toast({
        title: "Success",
        descrpition: res.message,
      });
      // Fetch signed user account after success 👇🏼
      await fetchAccount();
      resetFormErrors();
    } catch (error) {
      if (error.data.errors) {
        error.data.errors.map((e, i) => {
          _formErrors[[e.split(" ")[0].replace(/"/g, "")]] = e.replace(
            /"/g,
            ""
          );
        });
        setFormErrors(_formErrors);
        return;
      }
      resetFormErrors();
      toast({
        title: "Error",
        description: error?.data?.message,
      });
    }
  };

  return (
    <div className="h-[95vh] w-full">
      <section className="flex items-center justify-center h-full w-full">
        <Card className="relative w-full sm:w-[400px]">
          {/* Header 👇🏼*/}
          <CardHeader className="w-full text-[35px] text-center">
            <CardTitle className="text-[25px]">Create an account</CardTitle>
            <CardDescription className="text-muted-foreground text-[16px]">
              Enter your email, name and password to create new account
            </CardDescription>
          </CardHeader>

          {/* Server Response message 👇🏼 */}
          <div className="flex flex-col items-center gap-5 w-full py-2">
            <div className="w-full text-center">
              {data?.message && (
                <h3 className="text-sm text-[#69ff69]">{data.message}</h3>
              )}
            </div>
          </div>
          {/* Card Content 👇🏼 */}
          <CardContent className="flex flex-col gap-4 w-full">
            <div className="space-y-1">
              <Label>Fullname</Label>
              <Input
                type="text"
                placeholder="Joe Doe"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
              {formErrors.fullName && (
                <h3 className="text-sm text-[#ff5454] capitalize">
                  {formErrors.fullName}
                </h3>
              )}
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="text"
                placeholder="Enter Your Email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
              />
              {formErrors.email && (
                <h3 className="text-sm text-[#ff5454] capitalize">
                  {formErrors.email}
                </h3>
              )}
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="123*****"
                name="password"
                onChange={handleInputChange}
                value={formData.password.trim()}
              />
              {formErrors.password && (
                <h3 className="text-sm text-[#ff5454] capitalize">
                  {formErrors.password}
                </h3>
              )}
            </div>
          </CardContent>

          {/* Actions */}
          <CardFooter className="mt-2 flex flex-col gap-2 w-full">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {!isLoading ? "Signup now" : <SpinnerLoader />}
            </Button>
            <div className="flex gap-1 items-center w-full justify-center">
              <span className="text-sm">Or</span>
            </div>
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="w-full"
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section id="signup-left" />
    </div>
  );
};

export default Signup;
