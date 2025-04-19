import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/bookStore'

const bookCategories = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Romance', 
  'Fantasy', 'Biography', 'History', 'Science', 'Technology',
  'Self-Help', 'Children', 'Poetry', 'Comics', 'Art'
]

const conditions = ['new', 'like-new', 'good', 'fair', 'poor'] as const

export default function AddBook() {
  const navigate = useNavigate()
  const addBook = useStore(state => state.addBook)
  const currentUser = useStore(state => state.currentUser)

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    imageUrl: '',
    isbn: '',
    category: [] as string[],
    condition: 'good' as typeof conditions[number]
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      useStore.getState().setMessage('Please set up your profile in Settings first')
      navigate('/settings')
      return
    }

    addBook(formData)
    navigate('/')
  }

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }))
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Book</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-gray-700 mb-2">Author</label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-gray-700 mb-2">Image URL (optional)</label>
          <input
            type="url"
            id="imageUrl"
            value={formData.imageUrl}
            onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="isbn" className="block text-gray-700 mb-2">ISBN</label>
          <input
            type="text"
            id="isbn"
            value={formData.isbn}
            onChange={e => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Categories</label>
          <div className="flex flex-wrap gap-2">
            {bookCategories.map(category => (
              <button
                type="button"
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  formData.category.includes(category)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Condition</label>
          <div className="flex gap-4">
            {conditions.map(condition => (
              <label key={condition} className="flex items-center">
                <input
                  type="radio"
                  name="condition"
                  value={condition}
                  checked={formData.condition === condition}
                  onChange={e => setFormData(prev => ({ ...prev, condition: e.target.value as typeof conditions[number] }))}
                  className="mr-2"
                />
                <span className="capitalize">{condition}</span>
              </label>
            ))}
          </div>
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Book
        </button>
      </form>
    </div>
  )
}