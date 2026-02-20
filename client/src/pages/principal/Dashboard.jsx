import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from "recharts"

import { useEffect, useState } from "react"
import axios from "axios"
import PrincipalLayout from "../../components/layout/PrincipaLayout"

export default function Dashboard() {

  const [weekly, setWeekly] = useState([])
  const [weeklyInsight, setWeeklyInsight] = useState("")

  useEffect(() => {

    axios.get(
      "http://localhost:5000/api/analytics/weekly-enhanced",
      {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem("token")
        }
      }
    ).then(res => setWeekly(res.data))

    axios.get(
      "http://localhost:5000/api/analytics/weekly-ai",
      {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem("token")
        }
      }
    ).then(res =>
      setWeeklyInsight(res.data.insight)
    )

  }, [])

  return (
    <PrincipalLayout>

      <h2 className="text-xl mb-4 font-bold">
        Weekly Activity Trends
      </h2>

      {/* AI INSIGHT */}
      <div className=" p-4 rounded mb-6 bg-gray-400 text-gray-900">
        <h2 className="font-semibold mb-1 ">
          AI Weekly Insight
        </h2>
        <p>{weeklyInsight}</p>
      </div>

      {/* STACKED BAR CHART */}
      <div className="bg-white shadow rounded p-6 mb-10">
        <h2 className="text-lg mb-4">
          Weekly Distribution (Stacked)
        </h2>

        <BarChart width={750} height={350} data={weekly}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="lesson" stackId="a" />
          <Bar dataKey="quiz" stackId="a" />
          <Bar dataKey="assessment" stackId="a" />
        </BarChart>
      </div>

      {/* LINE CHART */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg mb-4">
          Weekly Trend (Line View)
        </h2>

        <LineChart width={750} height={350} data={weekly}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />

          <Line type="monotone" dataKey="lesson" />
          <Line type="monotone" dataKey="quiz" />
          <Line type="monotone" dataKey="assessment" />
        </LineChart>
      </div>

    </PrincipalLayout>
  )
}
