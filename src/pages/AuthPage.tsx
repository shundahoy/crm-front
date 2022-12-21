import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import {
  fetchAsyncLogin,
  fetchAsyncRegister,
} from "../features/auth/authSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const notify = (name: string) =>
    toast(`${name}さんを登録しました、ログインしてください`);
  const dispatch: AppDispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLogin) {
      await dispatch(
        fetchAsyncLogin({
          email,
          password,
        })
      );
    } else {
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/register`,
          {
            name,
            email,
            password,
            password_confirm: passwordConfirm,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          notify(res.data.name);
          setIsLogin(true);
        })
        .catch((err) => {
          alert(err);
        });
    }
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
  };
  return (
    <>
      <ToastContainer />
      <div className="flex min-h-[90vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              {isLogin ? "ログイン" : "登録"}画面
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="sr-only">
                    名前
                  </label>
                  <input
                    required
                    className="relative block w-full appearance-none rounded-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="名前"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                  />
                </div>
              )}
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  required
                  className="relative block w-full appearance-none rounded-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  value={password}
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="password_confirm" className="sr-only">
                    Password confirm
                  </label>
                  <input
                    value={passwordConfirm}
                    required
                    className="relative block w-full appearance-none rounded-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="password_confirm"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPasswordConfirm(e.target.value)
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "登録する" : "ログインする"}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isLogin ? "ログイン" : "登録"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
