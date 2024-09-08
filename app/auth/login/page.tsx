import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import LoginForm from "./_components/LoginForm";
import RegisterForm from "./_components/RegisterForm";

function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-3.6rem)] w-full overflow-hidden lg:grid lg:grid-cols-2">
      <div className="flex w-full items-center justify-center">
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden h-[calc(100vh-3.6rem)] bg-muted lg:block">
        <Image
          src="/images/img1.webp"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default LoginPage;
