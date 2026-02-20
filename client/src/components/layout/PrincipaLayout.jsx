import Sidebar from "./Sidebar"

export default function PrincipalLayout({
  children
}) {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />

      <div className="ml-64 p-6 w-full">
        {children}
      </div>
    </div>
  )
}
