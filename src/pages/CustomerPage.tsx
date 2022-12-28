import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import Layout from "../components/Layout";
import {
  selectLoginUser,
  fetchAsyncGetMyProf,
  selectIsLoading,
  startLoading,
  endLoading,
} from "../features/auth/authSlice";
import {
  createCustomer,
  deleteCustomer,
  fetchAsyncGetCustomer,
  fetchAsyncGetProgress,
  selectCustomers,
  selectProgress,
  updateCustomer,
} from "../features/customer/customerSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { linkSync } from "fs";
import PageNation from "../components/PageNation";
import { selectStatuses } from "../features/order/orderSlice";

const CustomerPage = () => {
  const updateNotify = () => toast(`保存しました。`);
  const deleteNotify = (id: number) => toast(`ID:${id}の顧客を消去しました`);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(startLoading());
      await dispatch(fetchAsyncGetCustomer(1));
      await dispatch(fetchAsyncGetProgress());
      await dispatch(endLoading());
    };
    fetchBootLoader();
  }, []);

  const customers = useSelector(selectCustomers);
  const allProgress = useSelector(selectProgress);

  const [id, setId] = useState<null | number>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [progress_id, setProgress_id] = useState<number>(0);
  const [memo, setMemo] = useState("");

  return (
    <Layout>
      <ToastContainer />
      <div className="">
        <h2 className="text-3xl text-center">顧客一覧</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
          <div className="col-span-1 lg:col-span-2">
            <button
              onClick={() => {
                setId(null);
                setName("");
                setUrl("");
                setEmail("");
                setTel("");
                setMemo("");
                setProgress_id(1);
              }}
              className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0 mb-4"
            >
              新規作成
            </button>
            <table className="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                    ID
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    名前
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    URL
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    営業進捗
                  </th>
                  {/* <th className="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br"></th> */}
                </tr>
              </thead>
              <tbody>
                {customers.data.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => {
                      setId(customer.id);
                      setName(customer.name);
                      setUrl(customer.url);
                      setEmail(customer.email);
                      setTel(customer.tel);
                      setMemo(customer.memo);
                      setProgress_id(customer.progress_id);
                    }}
                    className="cursor-pointer hover:bg-gray-200"
                  >
                    <td className="px-4 py-3">{customer.id}</td>
                    <td className="px-4 py-3">{customer.name}</td>
                    <td className="px-4 py-3 text-blue-400">
                      <a href={customer.url}>{customer.url}</a>
                    </td>
                    <td
                      className={`px-4 py-3 text-lg text-gray-900 progressid-${customer.progress_id}`}
                    >
                      {customer.progress?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PageNation
              from={customers.from}
              to={customers.to}
              total={customers.total}
              links={customers.links}
              last_page={customers.last_page}
            />
          </div>
          <div className="grid-cols-1 lg:col-span-2">
            {id ? (
              <>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <div>
                    <div className="overflow-hidden shadow sm:rounded-md">
                      <div className="bg-white px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6 sm:col-span-1">
                            <label className="block text-sm font-medium text-gray-700">
                              ID
                            </label>
                            <input
                              disabled
                              value={id}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                              名前
                            </label>
                            <input
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">
                              URL
                            </label>
                            <input
                              type="text"
                              name="url"
                              id="url"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="text"
                              name="email-address"
                              id="email-address"
                              autoComplete="email"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">
                              電話番号
                            </label>
                            <input
                              type="text"
                              name="tel"
                              id="tel"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                              value={tel}
                              onChange={(e) => setTel(e.target.value)}
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">
                              メモ
                            </label>
                            <textarea
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 min-h-[200px]"
                              onChange={(e) => setMemo(e.target.value)}
                              value={memo ? memo : ""}
                            ></textarea>
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                              進捗
                            </label>
                            <select
                              onChange={(e: any) =>
                                setProgress_id(e.target.value)
                              }
                              value={progress_id}
                              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                              {allProgress.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 flex gap-4">
                        <button
                          onClick={async () => {
                            await dispatch(
                              updateCustomer({
                                id,
                                name,
                                tel,
                                url,
                                email,
                                progress_id,
                                memo,
                              })
                            );
                            updateNotify();
                            setId(null);
                            setName("");
                            setUrl("");
                            setEmail("");
                            setTel("");
                            setMemo("");
                            setProgress_id(0);
                          }}
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          保存
                        </button>
                        <button
                          onClick={async () => {
                            await dispatch(deleteCustomer(id));
                            deleteNotify(id);
                            setId(null);
                            setName("");
                            setUrl("");
                            setEmail("");
                            setTel("");
                            setMemo("");
                            setProgress_id(0);
                          }}
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <div>
                    <div className="overflow-hidden shadow sm:rounded-md">
                      <div className="bg-white px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                              名前
                            </label>
                            <input
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">
                              URL
                            </label>
                            <input
                              type="text"
                              name="url"
                              id="url"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="text"
                              name="email-address"
                              id="email-address"
                              autoComplete="email"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">
                              電話番号
                            </label>
                            <input
                              type="text"
                              name="tel"
                              id="tel"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                              value={tel}
                              onChange={(e) => setTel(e.target.value)}
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">
                              メモ
                            </label>
                            <textarea
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 min-h-[200px]"
                              onChange={(e) => setMemo(e.target.value)}
                              value={memo ? memo : ""}
                            ></textarea>
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                              進捗
                            </label>
                            <select
                              onChange={(e: any) =>
                                setProgress_id(e.target.value)
                              }
                              value={progress_id}
                              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                              {allProgress.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 flex gap-4">
                        <button
                          onClick={() => {
                            dispatch(
                              createCustomer({
                                name,
                                tel,
                                url,
                                email,
                                progress_id,
                                memo,
                              })
                            );
                            updateNotify();
                            setId(null);
                            setName("");
                            setUrl("");
                            setEmail("");
                            setTel("");
                            setMemo("");
                            setProgress_id(0);
                          }}
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          新規登録
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerPage;
