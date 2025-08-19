export default function SimpleCorkBoard({ boardName }: { boardName: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
        {boardName} Cork Board
      </h1>
      <p className="text-xl text-center text-gray-600">
        This is a simple test component.
      </p>
    </div>
  )
}
