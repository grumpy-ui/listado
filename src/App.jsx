import { useState } from 'react'
import './App.css'

function App() {
  const [items, setItems] = useState([
    { text: 'Milk', bought: true },
    { text: 'Eggs', bought: false },
    { text: 'Bananas', bought: false },
    { text: 'Bread', bought: true },
  ])
  const [input, setInput] = useState('')

  const addItem = () => {
    if (input.trim() === '') return
    setItems([...items, { text: input.trim(), bought: false }])
    setInput('')
  }

  const toggleItem = (index) => {
    const newItems = [...items]
    newItems[index].bought = !newItems[index].bought
    setItems(newItems)
  }

  return (
    <div className="app">
      <h1>Shopping List</h1>

      <div className="input-bar">
        <input
          type="text"
          placeholder="Add item..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button onClick={addItem}>+</button>
      </div>

      <ul className="list">
        {items.map((item, index) => (
          <li
            key={index}
            className={item.bought ? 'bought' : ''}
            onClick={() => toggleItem(index)}
          >
            <input type="checkbox" checked={item.bought} readOnly />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>

      <footer>Made with ❤️ by Radu</footer>
    </div>
  )
}

export default App
