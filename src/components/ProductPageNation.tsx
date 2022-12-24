import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { fetchAsyncGetCustomer } from "../features/customer/customerSlice";
import { fetchAsyncGetOrders } from "../features/order/orderSlice";

export interface PROPS {
  from: number;
  to: number;
  total: number;
  links: any;
  last_page: number;
}

const ProductPageNation = (props: PROPS) => {
  const dispatch: AppDispatch = useDispatch();
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{props.from}</span> to{" "}
            <span className="font-medium">{props.to}</span> of{" "}
            <span className="font-medium">{props.total}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {props.links.map((link: any, i: number) => {
              if (i !== 0 && i !== props.last_page + 1) {
                return link.active ? (
                  <a
                    key={i}
                    onClick={async () => {
                      await dispatch(fetchAsyncGetOrders(i));
                    }}
                    aria-current="page"
                    className="cursor-pointer relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={i}
                    onClick={async () => {
                      await dispatch(fetchAsyncGetOrders(i));
                    }}
                    className="cursor-pointer relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                  >
                    {link.label}
                  </a>
                );
              }
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ProductPageNation;
