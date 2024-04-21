"use client";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const handleClick = () => {
    alert("Đăng nhập thành công");
    router.push("/");
  };
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => handleClick()}
            >
              Login
            </button>
            <a href="#" className="text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
