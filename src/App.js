import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [formData, setFormData] = useState({ stone: '', month: '' });
  const [birthStones, setBirthStones] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Saved data:', data);
        setFormData({ stone: '', month: '' });
        fetchAllBirthStones(); // データ保存後にリストを再取得
      })
      .catch(error => console.error('There was a problem with your fetch operation:', error));
  };

  const fetchAllBirthStones = () => {
    fetch('http://localhost:8080/all')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('All Birth Stones:', data);
        setBirthStones(data);
      })
      .catch(error => console.error('There was a problem with your fetch operation:', error));
  };

  useEffect(() => {
    fetchAllBirthStones(); // 初回マウント時にリストを取得
  }, []);

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Stone:</label>
            <input type="text" name="stone" value={formData.stone} onChange={handleChange} required />
          </div>
          <div>
            <label>Month:</label>
            <input type="text" name="month" value={formData.month} onChange={handleChange} required />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Stone</th>
              <th>Month</th>
            </tr>
          </thead>
          <tbody>
            {birthStones.map((stone) => (
              <tr key={stone.id}>
                <td>{stone.id}</td>
                <td>{stone.stone}</td>
                <td>{stone.month}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
