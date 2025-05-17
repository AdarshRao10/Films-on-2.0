// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import supabase from '../supabaseClient';
// import './ItemList.css';
// import { FaBold } from 'react-icons/fa';

// export default function ItemList() {
//   const [items, setItems]         = useState([]);
//   const [loading, setLoading]     = useState(true);
//   const [searchTerm, setSearch]   = useState('');
//   const [currentPage, setPage]    = useState(1);
//   const itemsPerPage              = 10;

//   useEffect(() => {
//     supabase
//       .from('Regular_titles')
//       .select('*')
//       .order('RegSerialNo', { ascending: false })
//       .then(({ data, error }) => {
//         if (!error) setItems(data);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div>Loading items…</div>;

//   // filter + paginate
//   const filtered    = items.filter(i => i.Title.toLowerCase().includes(searchTerm.toLowerCase()));
//   const totalPages  = Math.ceil(filtered.length / itemsPerPage);
//   const startIndex  = (currentPage - 1) * itemsPerPage;
//   const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

//   const goPage = n => {
//     if (n >= 1 && n <= totalPages) {
//       setPage(n);
//       window.scrollTo(0, 0);
//     }
//   };

//   return (
//     <div className="item-list-container">
//       <div className="list-header">
//         <h1> Regular Titles</h1>
//         {/* <Link to="/admin/items/new" className="btn add-new">
//           + Add New Regular Item
//         </Link> */}
//         <input
//           type="text"
//           placeholder="Search by title…"
//           value={searchTerm}
//           onChange={e => { setSearch(e.target.value); setPage(1); }}
//         />
//       </div>

//       <table className="item-table">
//         <thead>
//           <tr>
//             <th>Reg#</th>
//             <th>ProductID</th>
//             <th>Qty</th>
//             <th>Title</th>
//             <th>Release Year</th>
//             <th>Disc</th>
//             <th>Type</th>
//             <th>Price</th>
//             <th>Description</th>
//             <th>Poster</th>
//             <th>Genres</th>
//             <th>Director</th>
//             <th>Cast</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentItems.map(item => (
//             <tr key={item.RegSerialNo}>
//               <td>{item.RegSerialNo}</td>
//               <td>{item.ProductID}</td>
//               <td>{item.QtyToList}</td>
//               <td>{item.Title}</td>
//               <td>{item['Release Year']}</td>
//               <td>{item.Disc}</td>
//               <td>{item.Type}</td>
//               <td>${item.CurrentPrice.toFixed(2)}</td>
//               <td className="description-cell" title={item.Description}>
//                 {item.Description.length > 50
//                   ? item.Description.slice(0, 50) + '…'
//                   : item.Description
//                 }
//               </td>
//               <td>
//                 {item.PosterURL
//                   ? <img src={item.PosterURL} alt={item.Title} className="poster-thumb" />
//                   : <span className="no-image">—</span>
//                 }
//               </td>
//               <td>{item.Genres}</td>
//               <td>{item.Director}</td>
//               <td>{item.Cast}</td>
//               <td>
//                 <Link to={`/admin/items/${item.RegSerialNo}/edit`} className="btn-sm">
//                   Edit
//                 </Link>
//               <button
//                 className="btn-sm danger"
//                 onClick={async () => {
//                   const confirmDelete = window.confirm(`Are you sure you want to delete "${item.Title}"?`);
//                   if (!confirmDelete) return;

//                   await supabase
//                    .from('Regular_titles')
//                    .delete()
//                    .eq('RegSerialNo', item.RegSerialNo);
//                   setItems(items.filter(i => i.RegSerialNo !== item.RegSerialNo));
//                 }}
//               >
//                 Delete
//               </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {totalPages > 1 && (
//         <div className="pagination-container">
//           <button onClick={() => goPage(1)} disabled={currentPage === 1}>First</button>
//           <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
//           {Array.from({ length: totalPages }, (_, i) => i + 1)
//             .slice(
//               Math.max(0, currentPage - 3),
//               Math.min(totalPages, currentPage + 2)
//             )
//             .map((num) => (
//               <button
//                 key={num}
//                 onClick={() => goPage(num)}
//                 className={num === currentPage ? "active" : ""}
//               >
//                 {num}
//               </button>
//             ))}
//           <button onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
//           <button onClick={() => goPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
//         </div>
//       )}
//     </div>
//   );
// }





// src/admin/ItemList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import './ItemList.css';

export default function ItemList() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filters, setFilters]   = useState({
    serial: '', productId: '', title: '', year: '', genre: '', director: ''
  });
  const [currentPage, setPage]  = useState(1);
  const itemsPerPage            = 10;

  useEffect(() => {
    supabase
      .from('Regular_titles')
      .select('*')
      .order('RegSerialNo', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading items…</div>;

  // Apply filters
  const filtered = items.filter(item => {
    const {
      serial, productId, title, year, genre, director, collection
    } = filters;
    if (serial && !String(item.RegSerialNo).includes(serial)) return false;
    if (productId && !String(item.ProductID).includes(productId)) return false;
    if (title && !item.Title.toLowerCase().includes(title.toLowerCase())) return false;
    if (year && !String(item['Release Year']).includes(year)) return false;
    if (genre && !item.Genres.toLowerCase().includes(genre.toLowerCase())) return false;
    if (director && !item.Director.toLowerCase().includes(director.toLowerCase())) return false;
    // if (Collection && !item.Collection.toLowerCase().includes(collection.toLowerCase())) return false;
    
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const goPage = n => {
    if (n >= 1 && n <= totalPages) {
      setPage(n);
      window.scrollTo(0, 0);
    }
  };

  const onFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
    setPage(1);
  };

  return (
    <div className="item-list-container">
      <div className="list-header">
        <h1>Regular Titles</h1>
        <div className="filters">
          <input name="serial" placeholder="Serial#" value={filters.serial} onChange={onFilterChange} />
          <input name="productId" placeholder="Product ID" value={filters.productId} onChange={onFilterChange} />
          <input name="title" placeholder="Title" value={filters.title} onChange={onFilterChange} />
          <input name="year" placeholder="Release Year" value={filters.year} onChange={onFilterChange} />
          <input name="director" placeholder="Director" value={filters.director} onChange={onFilterChange} />
          <input name="genre" placeholder="Genre" value={filters.genre} onChange={onFilterChange} />
        </div>
      </div>

      <table className="item-table">
        <thead>
        <tr>
            <th>Reg#</th>
            <th>ProductID</th>
            <th>Qty</th>
            <th>Title</th>
            <th>Release Year</th>
            <th>Disc</th>
            <th>Type</th>
            <th>Price</th>
            {/* <th>Description</th> */}
            <th>Poster</th>
            <th>Genres</th>
            <th>Director</th>
            <th>Cast</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(item => (
            <tr key={item.RegSerialNo}>
              <td>{item.RegSerialNo}</td>
              <td>{item.ProductID}</td>
              <td>{item.QtyToList}</td>
              <td>{item.Title}</td>
              <td>{item['Release Year']}</td>
              <td>{item.Disc}</td>
              <td>{item.Type}</td>
              <td>${item.CurrentPrice.toFixed(2)}</td>
              {/* <td className="description-cell" title={item.Description}>
                {item.Description.length > 50 ? item.Description.slice(0, 50) + '…' : item.Description}
              </td> */}
              <td>
                {item.PosterURL ? (
                  <img src={item.PosterURL} alt={item.Title} className="poster-thumb" />
                ) : <span className="no-image">—</span>}
              </td>
              <td>{item.Genres}</td>
              <td>{item.Director}</td>
              <td>{item.Cast}</td>
              <td>
                <Link to={`/admin/items/${item.RegSerialNo}/edit`} className="btn-sm">Edit</Link>
                <button className="btn-sm danger" onClick={async () => {
                  if (!window.confirm(`Delete "${item.Title}"?`)) return;
                  await supabase.from('Regular_titles').delete().eq('RegSerialNo', item.RegSerialNo);
                  setItems(items.filter(i => i.RegSerialNo !== item.RegSerialNo));
                }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button onClick={() => goPage(1)} disabled={currentPage === 1}>First</button>
          <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
            .map(num => (
              <button key={num} onClick={() => goPage(num)} className={num === currentPage ? 'active' : ''}>{num}</button>
            ))}
          <button onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          <button onClick={() => goPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
        </div>
      )}
    </div>
  );
}