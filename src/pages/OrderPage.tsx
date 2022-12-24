import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import Layout from "../components/Layout";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  changeCartItem,
  createOrder,
  deleteOrder,
  fetchAsyncGetOrders,
  fetchAsyncGetStatus,
  initialCart,
  selectCart,
  selectOrders,
  selectStatuses,
  setCartItem,
  updateOrder,
} from "../features/order/orderSlice";
import {
  fetchAsyncGetProducts,
  selectProducts,
} from "../features/product/productSlice";
import { POST_PRODUCTS, SEARCH_RESULT } from "../features/types";
import OrderPageNation from "../components/OrderPageNation";
import axios from "axios";

const OrderPage = () => {
  const updateNotify = () => toast(`保存しました。`);
  const deleteNotify = (id: number) => toast(`ID:${id}の顧客を消去しました`);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetProducts());
      await dispatch(fetchAsyncGetStatus());
      await dispatch(fetchAsyncGetOrders(1));
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/`, {
        headers: {
          Authorization: `Bearer ${localStorage.localJWT}`,
          "Content-Type": "application/json",
        },
      });
      await dispatch(
        initialCart({
          allProducts: res.data,
        })
      );
    };
    fetchBootLoader();
  }, []);

  const orders = useSelector(selectOrders);
  const allProducts = useSelector(selectProducts);
  const cart = useSelector(selectCart);

  const allStatuses = useSelector(selectStatuses);

  const [id, setId] = useState<null | number>(null);
  const [customer, setCustomer] = useState({
    id: 0,
    name: "",
  });
  const [status, setStatus] = useState(1);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<SEARCH_RESULT[]>([]);

  const searchCustomer = async (query: string) => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/customer?search=${query}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.localJWT}`,
          "Content-Type": "application/json",
        },
      }
    );
    setResult(res.data);
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="">
        <h2 className="text-3xl text-center">注文一覧</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
          <div className="col-span-1 lg:col-span-2">
            <button
              onClick={() => {
                setId(null);
                setCustomer({ id: 0, name: "" });
                setStatus(1);
                dispatch(
                  initialCart({
                    allProducts,
                  })
                );
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
                    料金
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    ステータス
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.data.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => {
                      setId(order.id);
                      setCustomer({
                        name: order.customer.name,
                        id: order.customer_id,
                      });
                      dispatch(
                        setCartItem({
                          allProducts,
                          cartProducts: order.products,
                        })
                      );
                      setStatus(order.status_id);
                    }}
                    className="cursor-pointer hover:bg-gray-200"
                  >
                    <td className="px-4 py-3">{order.id}</td>
                    <td className="px-4 py-3">{order.customer.name}</td>
                    <td className="px-4 py-3">
                      {order.products
                        .map((i) => i.price * i.pivot.quantity)
                        .reduce(function (sum, element) {
                          return sum + element;
                        }, 0)}
                    </td>
                    <td className="px-4 py-3">{order.status.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <OrderPageNation
              from={orders.from}
              to={orders.to}
              total={orders.total}
              links={orders.links}
              last_page={orders.last_page}
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
                              readOnly
                              value={id}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                              注文者
                            </label>
                            <input
                              readOnly
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                              value={customer.name}
                              onClick={() => setIsOpen(true)}
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              進捗
                            </label>
                            <select
                              onChange={(e: any) => setStatus(e.target.value)}
                              value={status}
                              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                              {allStatuses.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {cart.map((item) => (
                            <div
                              className="col-span-6 sm:col-span-6 flex gap-4 items-center"
                              key={item.id}
                            >
                              <label className="block text-sm font-medium text-gray-700 flex-1">
                                {item.name}
                              </label>
                              <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <span className="text-gray-500 sm:text-sm">
                                    ￥
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  name="price"
                                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 flex-1"
                                  disabled
                                  value={item.price}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                  <div className="rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 flex-1">
                                    JPY
                                  </div>
                                </div>
                              </div>
                              <input
                                type="number"
                                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 flex-1"
                                value={item.quantity}
                                name="quantity"
                                onChange={(e) => {
                                  dispatch(
                                    changeCartItem({
                                      id: item.id,
                                      inputName: e.target.name,
                                      data: e.target.value,
                                    })
                                  );
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 flex gap-4">
                        <button
                          onClick={() => {
                            let newItems = cart.filter((i) => i.quantity > 0);
                            let postItems: POST_PRODUCTS[] = [];
                            newItems.map((item) => {
                              postItems.push({
                                product_id: item.id,
                                quantity: item.quantity,
                              });
                            });
                            dispatch(
                              updateOrder({
                                order_id: id,
                                customer_id: customer.id,
                                products: postItems,
                                status_id: status,
                              })
                            );
                            updateNotify();
                            setId(null);
                            setCustomer({ id: 0, name: "" });
                            setStatus(1);
                            dispatch(
                              initialCart({
                                allProducts,
                              })
                            );
                          }}
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          保存
                        </button>
                        <button
                          onClick={async () => {
                            await dispatch(deleteOrder(id));
                            deleteNotify(id);
                            setCustomer({ id: 0, name: "" });
                            setStatus(1);
                            setId(null);
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
                {}
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <div>
                    <div className="overflow-hidden shadow sm:rounded-md">
                      <div className="bg-white px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">
                              注文者
                            </label>
                            <input
                              readOnly
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                              value={customer.name}
                              onClick={() => setIsOpen(true)}
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              進捗
                            </label>
                            <select
                              onChange={(e: any) => setStatus(e.target.value)}
                              value={status}
                              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                              {allStatuses.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {cart.map((item) => (
                            <div
                              className="col-span-6 sm:col-span-6 flex gap-4 items-center"
                              key={item.id}
                            >
                              <label className="block text-sm font-medium text-gray-700 flex-1">
                                {item.name}
                              </label>
                              <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <span className="text-gray-500 sm:text-sm">
                                    ￥
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  name="price"
                                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 flex-1"
                                  disabled
                                  value={item.price}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                  <div className="rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 flex-1">
                                    JPY
                                  </div>
                                </div>
                              </div>
                              <input
                                type="number"
                                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 flex-1"
                                value={item.quantity}
                                name="quantity"
                                onChange={(e) => {
                                  dispatch(
                                    changeCartItem({
                                      id: item.id,
                                      inputName: e.target.name,
                                      data: e.target.value,
                                    })
                                  );
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 flex gap-4">
                        <button
                          onClick={() => {
                            let newItems = cart.filter((i) => i.quantity > 0);
                            let postItems: POST_PRODUCTS[] = [];
                            newItems.map((item) => {
                              postItems.push({
                                product_id: item.id,
                                quantity: item.quantity,
                              });
                            });
                            dispatch(
                              createOrder({
                                customer_id: customer.id,
                                products: postItems,
                                status_id: status,
                              })
                            );
                            setId(null);
                            setCustomer({ id: 0, name: "" });
                            setStatus(1);
                            dispatch(
                              initialCart({
                                allProducts,
                              })
                            );
                          }}
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          新規作成
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
      <Modal isOpen={modalIsOpen}>
        <button onClick={() => setIsOpen(false)}>Close Modal</button>
        <div className="flex lg:w-[50%] w-full sm:flex-row flex-col mx-auto px-2 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end container">
          <div className="relative flex-grow w-full lg:w-2/3">
            <label className="leading-7 text-sm text-gray-600">名前</label>
            <input
              type="text"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button
            onClick={() => searchCustomer(search)}
            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded"
          >
            検索
          </button>
        </div>
        <div className="mt-4 lg:w-[40%] w-full mx-auto overflow-auto">
          <table className="table-auto w-full text-left whitespace-no-wrap">
            <thead>
              <tr>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                  ID
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  名前
                </th>
              </tr>
            </thead>
            <tbody>
              {result &&
                result.map((customer) => (
                  <tr
                    className="cursor-pointer hover:bg-gray-200"
                    key={customer.id}
                    onClick={() => {
                      setCustomer({
                        id: customer.id,
                        name: customer.name,
                      });
                      setIsOpen(false);
                    }}
                  >
                    <td className="px-4 py-3">{customer.id}</td>
                    <td className="px-4 py-3">{customer.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </Layout>
  );
};

export default OrderPage;
