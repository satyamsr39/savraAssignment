import { useState } from "react"
import axios from "axios"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showRegister, setShowRegister] = useState(false)

  const [errors, setErrors] = useState({})
  const [loginError, setLoginError] = useState("")

  const clearInputs = () => {
    setEmail("")
    setPassword("")
    setName("")
    setErrors({})
    setLoginError("")
  }

  const validateName = (value) => {
    if (!value)
      setErrors((prev) => ({
        ...prev,
        name: "Name required"
      }))
    else
      setErrors((prev) => ({
        ...prev,
        name: ""
      }))
  }

  const validateEmail = (value) => {
    if (!value)
      setErrors((prev) => ({
        ...prev,
        email: "Email required"
      }))
    else if (
      !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)
    )
      setErrors((prev) => ({
        ...prev,
        email: "Invalid Gmail"
      }))
    else
      setErrors((prev) => ({
        ...prev,
        email: ""
      }))
  }

  const validatePassword = (value) => {
    if (!value)
      setErrors((prev) => ({
        ...prev,
        password: "Password required"
      }))
    else if (value.length < 6)
      setErrors((prev) => ({
        ...prev,
        password: "Minimum 6 characters"
      }))
    else
      setErrors((prev) => ({
        ...prev,
        password: ""
      }))
  }

  const isValidEmail =
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)
  const isValidPassword = password.length >= 6
  const isValidName = name.length > 0

  const login = async () => {
    setLoginError("")
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password }
      )
console.log(import.meta.env.VITE_BACKEND_URL)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)

      if (res.data.role === "teacher")
        window.location.href = "/teacher/create"
      else
        window.location.href =
          "/principal/dashboard"
    } catch (err) {
      setLoginError(
        err.response?.data?.msg ||
          "Login failed"
      )
    }
  }

  const register = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          name,
          email,
          password,
          role: "teacher"
        }
      )

      alert("Registered! Now login.")
      clearInputs()
      setShowRegister(false)
    } catch (err) {
      setErrors({
        email: "User already exists"
      })
    }
  }

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">

        {!showRegister ? (
          <>
            <h1 className="text-2xl mb-4">
              Login
            </h1>

            <input
              value={email}
              className="border p-2 w-full mb-1"
              placeholder="Gmail"
              onChange={(e) => {
                setEmail(e.target.value)
                validateEmail(e.target.value)
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">
                {errors.email}
              </p>
            )}

            <input
              value={password}
              className="border p-2 w-full mb-1"
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value)
                validatePassword(e.target.value)
              }}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">
                {errors.password}
              </p>
            )}

            <button
              onClick={login}
              className="bg-blue-500 text-white w-full py-2 rounded mt-2"
            >
              Login
            </button>

            <p
  className="text-purple-600 mt-3 cursor-pointer text-sm"
  onClick={() =>
    window.location.href =
      "/create-principal"
  }
>
  Create Principal Account
</p>


            {loginError && (
              <p className="text-red-500 text-sm mt-2">
                {loginError}
              </p>
            )}

            <p
              className="text-blue-500 mt-3 cursor-pointer"
              onClick={() => {
                clearInputs()
                setShowRegister(true)
              }}
            >
              New user? Register here
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl mb-4">
              Register
            </h1>

            <input
              value={name}
              className="border p-2 w-full mb-1"
              placeholder="Name"
              onChange={(e) => {
                setName(e.target.value)
                validateName(e.target.value)
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mb-2">
                {errors.name}
              </p>
            )}

            <input
              value={email}
              className="border p-2 w-full mb-1"
              placeholder="Gmail"
              onChange={(e) => {
                setEmail(e.target.value)
                validateEmail(e.target.value)
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">
                {errors.email}
              </p>
            )}

            <input
              value={password}
              className="border p-2 w-full mb-1"
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value)
                validatePassword(e.target.value)
              }}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">
                {errors.password}
              </p>
            )}

            <button
              onClick={register}
              disabled={
                !isValidEmail ||
                !isValidPassword ||
                !isValidName
              }
              className="bg-green-500 text-white w-full py-2 rounded disabled:bg-gray-400 mt-2"
            >
              Register
            </button>

            <p
              className="text-blue-500 mt-3 cursor-pointer"
              onClick={() => {
                clearInputs()
                setShowRegister(false)
              }}
            >
              Already registered? Login
            </p>
          </>
        )}

      </div>
    </div>
  )
}
