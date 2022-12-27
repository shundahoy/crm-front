import React, { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import {
  fetchAsyncGetMyProf,
  selectLoginUser,
} from "../features/auth/authSlice";
import { fetchAsyncGetCustomer } from "../features/customer/customerSlice";

type Props = {
  children: ReactNode;
};
const Layout = (props: Props) => {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetMyProf());
    };
    fetchBootLoader();
  }, []);
  const loginUser = useSelector(selectLoginUser);
  return (
    <div className="bg-gray-300">
      <header className="text-gray-600 body-font bg-white">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <img src="logo.png" alt="" className="w-[120px]" />
          </a>
          <nav className="md:mr-auto flex flex-wrap items-center text-base justify-center">
            <a href="/customer" className="mr-5 hover:text-gray-900">
              顧客一覧
            </a>
            <a href="/order" className="mr-5 hover:text-gray-900">
              注文一覧
            </a>
            <a href="/product" className="mr-5 hover:text-gray-900">
              商品一覧
            </a>
            <a href="/chart" className="mr-5 hover:text-gray-900">
              チャート
            </a>
          </nav>
          <p className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
            {loginUser.name}
          </p>
        </div>
      </header>

      <div className="p-4">
        <main className="container mx-auto px-4 py-8 min-h-[100vh] bg-white my-8 rounded-2xl">
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
