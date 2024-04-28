import { useState } from "react";
// Lib 👇🏼
import { useNavigate } from "react-router-dom";
// Api 👇🏼
import { useLoginMutation } from "@/api/services/auth.service";
import { useLazyFetchCurrentAccountQuery } from "@/api/services/account.service";
// Components 👇🏼
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/common/mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpinnerLoader } from "@/components/ui/loader";
// Hooks👇🏼
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [loginUser, { data, error, isError, isLoading }] = useLoginMutation();
  const [fetchAccount] = useLazyFetchCurrentAccountQuery();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [asAGusetIsLoading, setAsAGusetIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async () => {
    const res = await loginUser(formData);
    await fetchAccount();

    toast({
      title: "Server Response",
      description: res.data.message,
    });
  };

  const handleLoginAsGuest = async () => {
    setAsAGusetIsLoading(true);
    await loginUser({ email: "guest@gmail.com", password: "1111" });
    await fetchAccount();
    setAsAGusetIsLoading(false);
  };

  return (
    <section className="grid grid-cols-1 h-[90vh] w-full" id="login-page">
      <section className="flex items-center justify-center">
        {/* Card */}
        <Card className="relative w-full sm:w-[400px]">
          {/* Header */}
          <CardHeader className="w-full text-[35px] text-center h-fit">
            <CardTitle className="text-[25px]">Login now</CardTitle>
            <CardDescription className="text-muted-foreground text-[16px]">
              Enter your Email and password to login into your account
            </CardDescription>

            <div className="my-4">
              <Button
                onClick={handleLoginAsGuest}
                disabled={asAGusetIsLoading}
                className="w-full bg-invert text-invert-foreground font-semibold"
              >
                {asAGusetIsLoading ? <SpinnerLoader /> : "Contniue as a guest"}
              </Button>
            </div>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="w-full py-2 flex flex-col items-center gap-5 ">
            <div className="w-full text-center">
              {/* Response Message Output */}
              <div className="w-full text-center">
                {error?.status === "FETCH_ERROR" ? (
                  <h3 className="text-sm text-[#ff5454]">Network error</h3>
                ) : (
                  error?.data?.message && (
                    <h3 className="text-sm text-[#ff5454]">
                      {error.data.message}
                    </h3>
                  )
                )}
                {data?.message && (
                  <h3 className="text-sm text-[#69ff69]">{data.message}</h3>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="w-full flex flex-col gap-4">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter Your Email"
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="123*****"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                />
              </div>
            </div>
          </CardContent>

          {/* // Actions */}
          <CardFooter className="mt-2 flex flex-col gap-2 w-full">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                asAGusetIsLoading ? (
                  "Login"
                ) : (
                  <SpinnerLoader />
                )
              ) : (
                "Login"
              )}
            </Button>

            <div className="flex gap-1 items-center w-full justify-center">
              <span className="text-sm">Or</span>
            </div>
            <Button
              onClick={() => navigate("/signup")}
              variant="outline"
              className="w-full"
            >
              Signup
            </Button>
          </CardFooter>
        </Card>
      </section>
    </section>
  );
};

export default Login;
