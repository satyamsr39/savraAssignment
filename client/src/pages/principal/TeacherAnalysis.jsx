import { useEffect, useState } from "react"
import axios from "axios"
import PrincipalLayout from "../../components/layout/PrincipaLayout"

import {
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts"

import { motion } from "framer-motion"

export default function TeacherAnalysis() {

  const [teachers, setTeachers] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [data, setData] = useState([])
  const [subject, setSubject] = useState([])
  const [cls, setCls] = useState([])
  const [weekly, setWeekly] = useState([])
  const [loading, setLoading] = useState(false)
  const [teacher, setTeacher] = useState({})


  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(
        `${process.env.backendurl}/api/analytics/teachers`,
        {
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem("token")
          }
        }
      )
      setTeachers(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchTeacherData = async (id) => {
    setSelectedTeacher(id)
    setLoading(true)

    const token = localStorage.getItem("token")

    const headers = {
      Authorization: "Bearer " + token
    }

    try {
      const res = await axios.get(
  `${process.env.backendurl}/api/analytics/teacher-details/${id}`,
  {
    headers: {
      Authorization:
        "Bearer " +
        localStorage.getItem("token")
    }
  }
)

setData(res.data.summary)
setSubject(res.data.subject)
setCls(res.data.cls)
const formattedWeekly =
  res.data.weekly.map(item => ({
    week: item._id.week,
    count: item.count
  }))

setWeekly(formattedWeekly)

setTeacher(res.data.teacher)

    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  return (
    <PrincipalLayout>
      <div>

        <h1 className="text-2xl  mb-6 font-bold">
          Teacher Analysis
        </h1>

        <select
          value={selectedTeacher}
          onChange={(e) =>
            fetchTeacherData(e.target.value)
          }
          className="border-2 p-2 rounded mb-6"
        >
          <option value="">
            Select Teacher
          </option>
          

          {teachers.map((teacher) => (
            <option
              key={teacher._id}
              value={teacher._id}
            >
              {teacher.name}
            </option>
          ))}
        </select>

        <div className="bg-white shadow rounded p-4 mb-6">
  <h2 className="text-lg font-semibold">
    Teacher Profile
  </h2>

  <p>
    <b>ID:</b> {teacher._id}
  </p>

  <p>
    <b>Name:</b> {teacher.name}
  </p>

  <p>
    <b>Email:</b> {teacher.email}
  </p>
</div>

        {loading && (
          <p className="text-gray-500">
            Loading...
          </p>
        )}

        {!loading &&
          selectedTeacher &&
          data.length === 0 && (
            <p className="text-gray-500">
              No activity data found for
              this teacher.
            </p>
          )}

        {/* ACTIVITY CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {data.map((item) => (
            <motion.div
              key={item._id}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white shadow rounded p-6 text-center"
            >
              <h3 className="text-lg font-medium capitalize mb-2">
                {item._id}
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {item.count}
              </p>
            </motion.div>
          ))}
        </div>




        {/* CHARTS */}
        <div className="grid grid-cols-2 gap-8">

          {/* ACTIVITY TYPE PIE */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="mb-2 font-medium">
              Activity Type Distribution
            </h2>

            <PieChart width={300} height={300}>
  <Pie
    data={data}
    dataKey="count"
    nameKey="_id"
    cx="50%"
    cy="50%"
    outerRadius={100}
  />

              <Tooltip />
            </PieChart>
          </div>

          {/* SUBJECT BAR */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="mb-2 font-medium">
              Subject Breakdown
            </h2>

            <BarChart
              width={300}
              height={300}
              data={subject}
            >
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </div>

          {/* CLASS BAR */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="mb-2 font-medium">
              Class Breakdown
            </h2>

            <BarChart
              width={300}
              height={300}
              data={cls}
            >
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </div>

          {/* WEEKLY TREND */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="mb-2 font-medium">
              Weekly Activity Trend
            </h2>

            <BarChart
              width={400}
              height={300}
              data={weekly}
            >
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </div>

        </div>

      </div>
    </PrincipalLayout>
  )
}
