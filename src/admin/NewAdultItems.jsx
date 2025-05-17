import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import './ItemList.css';

export default function AdultItemList() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [searchTerm, setSearch] = useState('');
  const [currentPage, setPage]  = useState(1);
  const itemsPerPage            = 10;

  useEffect(() => {
    supabase
      .from('Adult_titles')
      .select('*')
      .order('AdultSerialNo', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading adult items…</div>;

  const filtered    = items.filter(i => i.Title.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages  = Math.ceil(filtered.length / itemsPerPage);
  const startIndex  = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const goPage = n => {
    if (n >= 1 && n <= totalPages) {
      setPage(n);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="item-list-container">
      <div className="list-header">
        <Link to="/admin/adult/items/new" className="btn add-new">
          + Add New Adult Item
        </Link>
        <input
          type="text"
          placeholder="Search by title…"
          value={searchTerm}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <table className="item-table">
        <thead>
          <tr>
            <th>Adult#</th>
            <th>ProductID</th>
            <th>Condition</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Title</th>
            <th>Production</th>
            <th>Release Date</th>
            <th>Poster</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(item => (
            <tr key={item.AdultSerialNo}>
              <td>{item.AdultSerialNo}</td>
              <td>{item.ProductID}</td>
              <td>{item.Condition}</td>
              <td>${item.Price.toFixed(2)}</td>
              <td>{item.Quantity}</td>
              <td>{item.Title}</td>
              <td>{item.Production}</td>
              <td>{item['Release Date']}</td>
              <td>
                {item.PosterURL
                  ? <img src={item.PosterURL} alt={item.Title} className="poster-thumb" />
                  : <span className="no-image">—</span>
                }
              </td>
              <td>
                <Link to={`/admin/adult/items/${item.AdultSerialNo}/edit`} className="btn-sm">
                  Edit
                </Link>
                <button
                  className="btn-sm danger"
                  onClick={async () => {
                    await supabase
                      .from('Adult_titles')
                      .delete()
                      .eq('AdultSerialNo', item.AdultSerialNo);
                    setItems(items.filter(i => i.AdultSerialNo !== item.AdultSerialNo));
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => goPage(1)} disabled={currentPage === 1}>First</button>
          <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i+1}
              className={currentPage === i+1 ? 'active' : ''}
              onClick={() => goPage(i+1)}
            >
              {i+1}
            </button>
          ))}
          <button onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          <button onClick={() => goPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
        </div>
      )}
    </div>
  );
}
