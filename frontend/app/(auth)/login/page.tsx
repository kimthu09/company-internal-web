import Image from "next/image";
import LoginForm from "@/components/login/loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập",
};
const Login = async () => {
  return (
    <div className="bg-auth-background bg-right bg-cover bg-no-repeat flex flex-1 flex-col p-8">
      <Image
        src="/companion.png"
        alt="logo"
        width={233}
        height={62}
      ></Image>
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex flex-row self-center gap-36">
          <Image
            src="/auth-image-1.png"
            alt="image-1"
            width={500}
            height={500}
            className="lg:block hidden"
          />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
