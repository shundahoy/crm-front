import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import Layout from "../components/Layout";
import {
  selectLoginUser,
  fetchAsyncGetMyProf,
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
import {
  createProduct,
  deleteProduct,
  fetchAsyncGetProducts,
  selectProducts,
  updateProduct,
} from "../features/product/productSlice";
import ProductPageNation from "../components/ProductPageNation";

const ProductPage = () => {
  const updateNotify = () => toast(`保存しました。`);
  const deleteNotify = (id: number) => toast(`ID:${id}の商品を消去しました`);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetProducts());
    };
    fetchBootLoader();
  }, []);
  const allProducts = useSelector(selectProducts);
  const [id, setId] = useState<null | number>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [memo, setMemo] = useState<string>("");

  return (
    <Layout>
      <ToastContainer />
      <div className="">
        <h2 className="text-3xl text-center">商品一覧</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
          <div className="col-span-1 lg:col-span-2">
            <button
              onClick={() => {
                setId(null);
                setName("");
                setMemo("");
                setPrice(0);
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
                    値段
                  </th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => {
                      setId(product.id);
                      setName(product.name);
                      setMemo(product.memo);
                      setPrice(product.price);
                    }}
                    className="cursor-pointer hover:bg-gray-200"
                  >
                    <td className="px-4 py-3">{product.id}</td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <ProductPageNation
              from={product.from}
              to={product.to}
              total={product.total}
              links={product.links}
              last_page={product.last_page}
            /> */}
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

                          <div className="relative col-span-6 sm:col-span-3 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">
                                ￥
                              </span>
                            </div>
                            <input
                              type="number"
                              name="price"
                              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 flex-1"
                              value={price}
                              onChange={(e) =>
                                setPrice(parseInt(e.target.value))
                              }
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <div className="rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 flex-1">
                                JPY
                              </div>
                            </div>
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
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 flex gap-4">
                        <button
                          onClick={async () => {
                            await dispatch(
                              updateProduct({
                                product_id: id,
                                price,
                                name,
                                memo,
                              })
                            );
                            updateNotify();
                            setId(null);
                            setName("");
                            setMemo("");
                            setPrice(0);
                          }}
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          保存
                        </button>
                        <button
                          onClick={async () => {
                            await dispatch(deleteProduct(id));
                            deleteNotify(id);
                            setId(null);
                            setName("");
                            setMemo("");
                            setPrice(0);
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
                          <div className="col-span-6 sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">
                              名前
                            </label>
                            <input
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>

                          <div className="relative col-span-6 sm:col-span-3 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">
                                ￥
                              </span>
                            </div>
                            <input
                              type="number"
                              name="price"
                              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 flex-1"
                              value={price}
                              onChange={(e) =>
                                setPrice(parseInt(e.target.value))
                              }
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <div className="rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 flex-1">
                                JPY
                              </div>
                            </div>
                          </div>

                          <div className="col-span-6 sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">
                              メモ
                            </label>
                            <textarea
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 min-h-[200px]"
                              onChange={(e) => setMemo(e.target.value)}
                              value={memo}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 flex gap-4">
                        <button
                          onClick={async () => {
                            await dispatch(
                              createProduct({
                                price,
                                name,
                                memo,
                              })
                            );
                            updateNotify();
                            setId(null);
                            setName("");
                            setMemo("");
                            setPrice(0);
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

export default ProductPage;
