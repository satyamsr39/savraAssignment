import { useEffect, useState } from "react"
import axios from "axios"

export default function MyActivities() {

  const [activities, setActivities] =
    useState([])

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/activity/my",
        {
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem("token")
          }
        }
      )
      setActivities(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="p-6 bg-gray-200 text-slate-900">

      <h1 className="text-2xl mb-6 font-bold">
        My Activities
      </h1>

      <table className="w-full border shadow-xl ">

        <thead className="bg-gray-200 rounded-3xl">
  <tr>
    <th className="p-2">Teacher ID</th>
    <th className="p-2">Teacher Name</th>
    <th className="p-2">Type</th>
    <th className="p-2">Subject</th>
    <th className="p-2">Class</th>
    <th className="p-2">Date</th>
  </tr>
</thead>


       <tbody>
  {activities.map((act) => (
    <tr
      key={act._id}
      className="text-center border"
    >

      <td className="p-2">
        {act.teacher_id?._id}
      </td>

      <td className="p-2">
        {act.teacher_id?.name}
      </td>

      <td className="p-2 capitalize">
        {act.activity_type}
      </td>

      <td className="p-2">
        {act.subject}
      </td>

      <td className="p-2">
        {act.class}
      </td>

      <td className="p-2">
        {new Date(
          act.created_at
        ).toLocaleDateString()}
      </td>

    </tr>
  ))}
</tbody>


      </table>

    </div>
  )
}
