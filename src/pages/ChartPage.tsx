import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import Layout from "../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createProduct,
  deleteProduct,
  fetchAsyncGetProducts,
  selectProducts,
  updateProduct,
} from "../features/product/productSlice";
import { endLoading, startLoading } from "../features/auth/authSlice";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { CHART } from "../features/types";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
    },
  },
};

const ChartPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const [cahrtDataDay, setChartDataDay] = useState<CHART[]>([]);
  const [cahrtDataMonth, setChartDataMonth] = useState<CHART[]>([]);
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(startLoading());
      const resDay = await axios.get(
        `${process.env.REACT_APP_API_URL}/chart/day`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.localJWT}`,
            "Content-Type": "application/json",
          },
        }
      );
      const resMonth = await axios.get(
        `${process.env.REACT_APP_API_URL}/chart/month`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.localJWT}`,
            "Content-Type": "application/json",
          },
        }
      );
      setChartDataDay(resDay.data);
      setChartDataMonth(resMonth.data);
      await dispatch(endLoading());
    };
    fetchBootLoader();
  }, []);

  return (
    <Layout>
      <ToastContainer />
      <div className="">
        <h2 className="text-3xl text-center">売上チャート</h2>
        <button
          onClick={() => {
            setIsDay(!isDay);
          }}
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0 mb-4"
        >
          {isDay ? "日別" : "月別"}
        </button>
        <div className="mt-4">
          <Bar
            options={options}
            data={{
              labels: isDay
                ? cahrtDataDay.map((item) => item.date)
                : cahrtDataMonth.map((item) => item.date),
              datasets: [
                {
                  data: isDay
                    ? cahrtDataDay.map((item) => parseInt(item.sum))
                    : cahrtDataMonth.map((item) => parseInt(item.sum)),
                  label: "売上",
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
              ],
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ChartPage;
