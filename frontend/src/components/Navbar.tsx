export const Navbar = () => {
  return (
    <div className="flex w-full flex-row justify-between px-20 items-center py-5 border-b border-b-gray-400 h-14 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">CodeDamn Project</h1>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
        Sign In
      </button>
    </div>
  )
}
