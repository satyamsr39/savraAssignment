import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function CreatePrincipal() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] =
    useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()
const [secret, setSecret] =
  useState("")

  const createPrincipal = async () => {

    try {

      await axios.post(
        `${process.env.backendurl}/api/auth/create-principal`,
       {
  name,
  email,
  password,
  secret
}

      )

      alert("Principal Created")

      navigate("/")

    } catch (err) {

      setError(
        err.response?.data?.msg ||
          "Creation failed"
      )
    }
  }

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded shadow w-96">

        <h1 className="text-2xl mb-4">
          Create Principal
        </h1>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Name"
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Gmail"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <input
  type="password"
  className="border p-2 w-full mb-3"
  placeholder="Admin Secret Key"
  onChange={(e) =>
    setSecret(e.target.value)
  }
/>


        <button
          onClick={createPrincipal}
          className="bg-purple-500 text-white w-full py-2 rounded"
        >
          Create Principal
        </button>

        {error && (
          <p className="text-red-500 mt-2">
            {error}
          </p>
        )}

      </div>

    </div>
  )
}
