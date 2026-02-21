import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function CreateActivity() {
  const [type, setType] = useState("lesson")
  const [subject, setSubject] = useState("")
  const [cls, setCls] = useState("")
 const navigate=useNavigate()

  const create = async () => {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/activity/create`,
      {
        activity_type: type,
        subject,
        class: cls,
        
      },
      {
        headers: {
          Authorization:
            "Bearer " +
            localStorage.getItem("token")
        }
      }
    )
    alert("Activity Created")
  }

  return (
    <div className="p-8 bg-gray-200">
      <h2 className="text-2xl mb-4 font-bold">
        Create Activity
      </h2>

      <select
        className="border-2 rounded p-2 m-3"
        onChange={(e) =>
          setType(e.target.value)
        }
      >
        <option>lesson plan</option>
        <option>quiz</option>
        <option>assessment</option>
      </select>

      <input
        className="border-2 rounded p-2 m-3"
        placeholder="Subject"
        onChange={(e) =>
          setSubject(e.target.value)
        }
      />
    

      <input
        className="border-2 rounded p-2 m-3"
        placeholder="Class"
        onChange={(e) =>
          setCls(e.target.value)
        }
      />

      <button
        onClick={create}
        className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        Create
      </button>

       <button
    onClick={() => navigate("/teacher/my")}
    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
  >
    View My Activities
  </button>
    </div>
  )
}
